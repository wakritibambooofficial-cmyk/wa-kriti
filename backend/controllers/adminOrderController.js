const Order = require('../models/Order');
const razorpay = require('../config/razorpay');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');
const { sendOrderStatusEmail } = require('../services/emailService');
const { notifyUser } = require('../services/notificationService');
const { releaseReservedStock } = require('./orderController');
const logger = require('../utils/logger');

/**
 * @route GET /api/v1/admin/orders
 * Query: page, limit, status, paymentStatus, q (order number)
 */
const getAllOrders = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, parseInt(req.query.limit, 10) || 20);

  const filter = {};
  if (req.query.status) filter.orderStatus = req.query.status;
  if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;
  if (req.query.q) filter.orderNumber = new RegExp(req.query.q, 'i');

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('customer', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Order.countDocuments(filter),
  ]);

  return sendSuccess(res, 200, 'Orders fetched', { orders }, { page, limit, total, totalPages: Math.ceil(total / limit) });
});

/**
 * @route PATCH /api/v1/admin/orders/:id/status
 * Body: { status, description, trackingNumber, shippingPartner }
 */
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, description = '', trackingNumber, shippingPartner } = req.body;
  const order = await Order.findById(req.params.id).populate('customer', 'firstName email');
  if (!order) throw ApiError.notFound('Order not found');

  order.orderStatus = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (shippingPartner) order.shippingPartner = shippingPartner;
  order.timeline.push({ status, description, updatedBy: req.user._id });

  if (status === 'delivered' && !order.rewardPointsAwarded && order.paymentStatus === 'paid') {
    const { applyRewardTransaction } = require('./loyaltyController');
    const POINTS_PER_RUPEE = 0.01; // 1 point per ₹100 spent
    const pointsEarned = Math.floor(order.grandTotal * POINTS_PER_RUPEE);
    if (pointsEarned > 0) {
      await applyRewardTransaction(order.customer._id, {
        type: 'earned',
        points: pointsEarned,
        reason: 'purchase',
        description: `Earned from order ${order.orderNumber}`,
        order: order._id,
      });
      order.rewardPointsAwarded = true;
    }
  }

  await order.save();

  await notifyUser(order.customer._id, {
    type: 'order',
    title: 'Order Status Updated',
    message: `Your order ${order.orderNumber} is now "${status.replace(/_/g, ' ')}".`,
    link: `/dashboard/orders/${order._id}`,
  });

  if (order.customer?.email) {
    sendOrderStatusEmail(order.customer.email, {
      firstName: order.customer.firstName,
      orderNumber: order.orderNumber,
      status,
      trackingNumber: order.trackingNumber,
    }).catch((e) => logger.error(e.message));
  }

  return sendSuccess(res, 200, 'Order status updated', { order });
});

/**
 * @route POST /api/v1/admin/orders/:id/refund
 * Body: { amount, reason } — amount optional (full refund if omitted)
 */
const issueRefund = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('customer', 'firstName email');
  if (!order) throw ApiError.notFound('Order not found');
  if (order.paymentStatus !== 'paid' && order.paymentStatus !== 'refunded') {
    throw ApiError.conflict('Only paid orders can be refunded');
  }
  if (!order.razorpayPaymentId) throw ApiError.conflict('No payment record found for this order to refund');

  const { amount, reason = 'Refund issued by admin' } = req.body;
  const refundAmount = amount ? Math.round(amount * 100) : undefined; // paise; undefined = full refund

  const refund = await razorpay.payments.refund(order.razorpayPaymentId, {
    amount: refundAmount,
    notes: { reason },
  });

  order.paymentStatus = 'refunded';
  order.timeline.push({ status: 'refunded', description: reason, updatedBy: req.user._id });
  await order.save();

  await notifyUser(order.customer._id, {
    type: 'refund',
    title: 'Refund Processed',
    message: `A refund has been issued for order ${order.orderNumber}.`,
    link: `/dashboard/orders/${order._id}`,
  });

  return sendSuccess(res, 200, 'Refund processed successfully', { order, refund });
});

/**
 * @route POST /api/v1/admin/orders/:id/cancel
 * Admin-initiated cancellation (distinct from customer self-cancel route).
 */
const adminCancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('customer', 'firstName email');
  if (!order) throw ApiError.notFound('Order not found');
  if (['delivered', 'cancelled'].includes(order.orderStatus)) {
    throw ApiError.conflict(`Order cannot be cancelled once it is ${order.orderStatus}`);
  }

  order.orderStatus = 'cancelled';
  order.cancelReason = req.body.reason || 'Cancelled by admin';
  order.cancelledAt = new Date();
  order.timeline.push({ status: 'cancelled', description: order.cancelReason, updatedBy: req.user._id });
  await order.save();

  await releaseReservedStock(order);

  await notifyUser(order.customer._id, {
    type: 'order',
    title: 'Order Cancelled',
    message: `Your order ${order.orderNumber} was cancelled by our team: ${order.cancelReason}`,
    link: `/dashboard/orders/${order._id}`,
  });

  return sendSuccess(res, 200, 'Order cancelled successfully', { order });
});

/**
 * @route GET /api/v1/admin/orders/stats
 * Quick dashboard widget numbers.
 */
const getOrderStats = asyncHandler(async (req, res) => {
  const [pending, completed, cancelled, returnRequests, totalRevenueAgg] = await Promise.all([
    Order.countDocuments({ orderStatus: { $in: ['placed', 'confirmed', 'packed', 'shipped', 'out_for_delivery'] } }),
    Order.countDocuments({ orderStatus: 'delivered' }),
    Order.countDocuments({ orderStatus: 'cancelled' }),
    Order.countDocuments({ orderStatus: { $in: ['returned', 'exchange_requested'] } }),
    Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$grandTotal' } } }]),
  ]);

  return sendSuccess(res, 200, 'Order stats fetched', {
    pending,
    completed,
    cancelled,
    returnRequests,
    totalRevenue: totalRevenueAgg[0]?.total || 0,
  });
});

module.exports = { getAllOrders, updateOrderStatus, issueRefund, adminCancelOrder, getOrderStats };
