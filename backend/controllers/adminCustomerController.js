const User = require('../models/User');
const Order = require('../models/Order');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * @route GET /api/v1/admin/customers
 * Query: page, limit, q (name/email), status
 */
const getAllCustomers = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, parseInt(req.query.limit, 10) || 20);

  const filter = { role: 'customer' };
  if (req.query.status) filter.status = req.query.status;
  if (req.query.q) {
    filter.$or = [
      { firstName: new RegExp(req.query.q, 'i') },
      { lastName: new RegExp(req.query.q, 'i') },
      { email: new RegExp(req.query.q, 'i') },
    ];
  }

  const [customers, total] = await Promise.all([
    User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  return sendSuccess(res, 200, 'Customers fetched', { customers }, { page, limit, total, totalPages: Math.ceil(total / limit) });
});

/**
 * @route GET /api/v1/admin/customers/:id
 */
const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await User.findOne({ _id: req.params.id, role: 'customer' }).select('-password');
  if (!customer) throw ApiError.notFound('Customer not found');

  const orders = await Order.find({ customer: customer._id }).sort({ createdAt: -1 }).limit(10);
  const orderCount = await Order.countDocuments({ customer: customer._id });
  const totalSpentAgg = await Order.aggregate([
    { $match: { customer: customer._id, paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$grandTotal' } } },
  ]);

  return sendSuccess(res, 200, 'Customer fetched', {
    customer,
    recentOrders: orders,
    orderCount,
    totalSpent: totalSpentAgg[0]?.total || 0,
  });
});

/**
 * @route PATCH /api/v1/admin/customers/:id/block
 */
const toggleBlockCustomer = asyncHandler(async (req, res) => {
  const customer = await User.findOne({ _id: req.params.id, role: 'customer' });
  if (!customer) throw ApiError.notFound('Customer not found');

  customer.status = customer.status === 'blocked' ? 'active' : 'blocked';
  await customer.save();

  return sendSuccess(res, 200, `Customer ${customer.status === 'blocked' ? 'blocked' : 'unblocked'} successfully`, { customer });
});

module.exports = { getAllCustomers, getCustomerById, toggleBlockCustomer };
