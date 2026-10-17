const crypto = require('crypto');
const Order = require('../models/Order');
const User = require('../models/User');
const { finalizeSuccessfulOrder } = require('./orderController');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../utils/logger');

/**
 * @route POST /api/webhooks/razorpay
 * Server-to-server confirmation from Razorpay, independent of whether the
 * customer's browser ever calls /verify-payment. Mounted with express.raw()
 * in app.js so req.body is the raw Buffer needed for signature verification.
 */
const razorpayWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(req.body)
    .digest('hex');

  if (signature !== expectedSignature) {
    logger.error('Razorpay webhook: signature mismatch');
    return res.status(400).json({ success: false });
  }

  const event = JSON.parse(req.body);

  if (event.event === 'payment.captured') {
    const razorpayOrderId = event.payload.payment.entity.order_id;
    const order = await Order.findOne({ razorpayOrderId });

    if (order && order.paymentStatus !== 'paid') {
      order.paymentStatus = 'paid';
      order.razorpayPaymentId = event.payload.payment.entity.id;
      order.orderStatus = 'confirmed';
      order.timeline.push({ status: 'confirmed', description: 'Payment confirmed via webhook' });
      await order.save();

      const user = await User.findById(order.customer);
      await finalizeSuccessfulOrder(order, user);
    }
  }

  res.status(200).json({ success: true });
});

module.exports = { razorpayWebhook };