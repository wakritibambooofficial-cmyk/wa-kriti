const ReturnRequest = require('../models/ReturnRequest');
const Order = require('../models/Order');
const razorpay = require('../config/razorpay');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');
const { uploadBufferToCloudinary } = require('../config/cloudinary');
const { notifyUser, notifyAdmins } = require('../services/notificationService');

/**
 * @route POST /api/v1/returns
 * Body: { orderId, orderItemId, type, reason, description, exchangeVariantId }
 */ 
const createReturnRequest = asyncHandler(async (req, res) => {
  const { orderId, orderItemId, type, reason, description = '', exchangeVariantId = null } = req.body;

  const order = await Order.findOne({ _id: orderId, customer: req.user._id });
  if (!order) throw ApiError.notFound('Order not found');
  if (order.orderStatus !== 'delivered') {
    throw ApiError.conflict('Returns/exchanges can only be requested for delivered orders');
  }

  const item = order.items.id(orderItemId);
  if (!item) throw ApiError.notFound('Order item not found');

  const existing = await ReturnRequest.findOne({ order: orderId, orderItemId });
  if (existing) throw ApiError.conflict('A return/exchange request already exists for this item');

  let images = [];
  if (req.files?.length) {
    const uploads = await Promise.all(req.files.map((f) => uploadBufferToCloudinary(f.buffer, 'returns')));
    images = uploads.map((u) => ({ url: u.url, publicId: u.publicId }));
  }

  const returnRequest = await ReturnRequest.create({
    order: orderId,
    orderItemId,
    user: req.user._id,
    type,
    reason,
    description,
    images,
    exchangeVariantId,
  });

  order.orderStatus = type === 'exchange' ? 'exchange_requested' : order.orderStatus;
  order.timeline.push({
    status: type === 'exchange' ? 'exchange_requested' : 'returned',
    description: `${type === 'exchange' ? 'Exchange' : 'Return'} requested by customer: ${reason}`,
  });
  await order.save();

  await notifyAdmins({
    type: type === 'exchange' ? 'exchange' : 'return',
    title: `New ${type === 'exchange' ? 'Exchange' : 'Return'} Request`,
    message: `Order ${order.orderNumber}: ${item.name}`,
    link: `/admin/returns/${returnRequest._id}`,
  });

  return sendSuccess(res, 201, `${type === 'exchange' ? 'Exchange' : 'Return'} request submitted successfully`, {
    returnRequest,
  });
});

/**
 * @route GET /api/v1/returns/my
 */
const getMyReturnRequests = asyncHandler(async (req, res) => {
  const requests = await ReturnRequest.find({ user: req.user._id })
    .populate('order', 'orderNumber')
    .sort({ createdAt: -1 });
  return sendSuccess(res, 200, 'Return requests fetched', { requests });
});

/**
 * @route GET /api/v1/admin/returns
 */
const getAllReturnRequests = asyncHandler(async (req, res) => {
  const { status, type } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (type) filter.type = type;

  const requests = await ReturnRequest.find(filter)
    .populate('user', 'firstName lastName email')
    .populate('order', 'orderNumber grandTotal')
    .sort({ createdAt: -1 });

  return sendSuccess(res, 200, 'Return requests fetched', { requests });
});

/**
 * @route PATCH /api/v1/admin/returns/:id
 * Body: { status, adminNotes, refundType, refundAmount }
 */
const updateReturnRequest = asyncHandler(async (req, res) => {
  const { status, adminNotes = '', refundType, refundAmount } = req.body;

  const returnRequest = await ReturnRequest.findById(req.params.id).populate('order');
  if (!returnRequest) throw ApiError.notFound('Return request not found');

  returnRequest.status = status;
  returnRequest.adminNotes = adminNotes;
  if (refundType) returnRequest.refundType = refundType;
  if (refundAmount !== undefined) returnRequest.refundAmount = refundAmount;
  await returnRequest.save();

  const order = returnRequest.order;

  if (status === 'approved' && returnRequest.type === 'return' && refundAmount > 0) {
    if (order.razorpayPaymentId) {
      await razorpay.payments.refund(order.razorpayPaymentId, {
        amount: Math.round(refundAmount * 100),
        notes: { reason: `Return approved: ${adminNotes}` },
      });
    }
    order.timeline.push({ status: 'refunded', description: `Refund of ₹${refundAmount} processed for return` });
    await order.save();
  }

  if (status === 'completed') {
    order.orderStatus = returnRequest.type === 'exchange' ? 'exchange_completed' : 'returned';
    order.timeline.push({ status: order.orderStatus, description: `${returnRequest.type} completed` });
    await order.save();
  }

  await notifyUser(returnRequest.user, {
    type: returnRequest.type === 'exchange' ? 'exchange' : 'return',
    title: `${returnRequest.type === 'exchange' ? 'Exchange' : 'Return'} ${status}`,
    message: `Your ${returnRequest.type} request has been ${status}.`,
    link: `/dashboard/orders/${order._id}`,
  });

  return sendSuccess(res, 200, 'Return request updated', { returnRequest });
});

module.exports = { createReturnRequest, getMyReturnRequests, getAllReturnRequests, updateReturnRequest };
