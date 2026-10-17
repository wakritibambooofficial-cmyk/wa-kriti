const Subscription = require('../models/Subscription');
const Product = require('../models/Product');
const Address = require('../models/Address');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');

const FREQUENCY_DAYS = { monthly: 30, quarterly: 90, yearly: 365 };

/**
 * @route POST /api/v1/subscriptions
 * Body: { productId, variantId, frequency, quantity, addressId }
 */
const createSubscription = asyncHandler(async (req, res) => {
  const { productId, variantId = null, frequency, quantity = 1, addressId } = req.body;

  const product = await Product.findOne({ _id: productId, status: 'published' });
  if (!product) throw ApiError.notFound('Product not found');

  const address = await Address.findOne({ _id: addressId, user: req.user._id });
  if (!address) throw ApiError.badRequest('Invalid shipping address');

  const days = FREQUENCY_DAYS[frequency] || 30;
  const subscription = await Subscription.create({
    user: req.user._id,
    product: product._id,
    variantId,
    frequency,
    quantity,
    shippingAddress: address._id,
    nextDeliveryDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
  });

  return sendSuccess(res, 201, 'Subscription created successfully', { subscription });
});

/**
 * @route GET /api/v1/subscriptions/my
 */
const getMySubscriptions = asyncHandler(async (req, res) => {
  const subscriptions = await Subscription.find({ user: req.user._id })
    .populate('product', 'name slug images price')
    .populate('shippingAddress')
    .sort({ createdAt: -1 });

  return sendSuccess(res, 200, 'Subscriptions fetched', { subscriptions });
});

/**
 * @route PATCH /api/v1/subscriptions/:id/pause
 */
const pauseSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findOne({ _id: req.params.id, user: req.user._id });
  if (!subscription) throw ApiError.notFound('Subscription not found');

  subscription.status = subscription.status === 'paused' ? 'active' : 'paused';
  await subscription.save();

  return sendSuccess(res, 200, `Subscription ${subscription.status}`, { subscription });
});

/**
 * @route DELETE /api/v1/subscriptions/:id
 */
const cancelSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findOne({ _id: req.params.id, user: req.user._id });
  if (!subscription) throw ApiError.notFound('Subscription not found');

  subscription.status = 'cancelled';
  await subscription.save();

  return sendSuccess(res, 200, 'Subscription cancelled successfully', { subscription });
});

/**
 * @route GET /api/v1/admin/subscriptions
 * Admin: view all active subscriptions across customers.
 */
const getAllSubscriptionsAdmin = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const subscriptions = await Subscription.find(filter)
    .populate('user', 'firstName lastName email')
    .populate('product', 'name slug')
    .sort({ nextDeliveryDate: 1 });

  return sendSuccess(res, 200, 'Subscriptions fetched', { subscriptions });
});

module.exports = {
  createSubscription,
  getMySubscriptions,
  pauseSubscription,
  cancelSubscription,
  getAllSubscriptionsAdmin,
};
