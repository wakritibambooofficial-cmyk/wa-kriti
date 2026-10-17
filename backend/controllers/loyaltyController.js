const User = require('../models/User');
const { WalletTransaction, RewardTransaction } = require('../models/Loyalty');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');
const { notifyUser } = require('../services/notificationService');

/**
 * Credits or debits a user's wallet and records the transaction. Throws if
 * a debit would overdraw the balance.
 */
const applyWalletTransaction = async (userId, { type, amount, reason, description = '', order = null }) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');

  if (type === 'debit' && user.walletBalance < amount) {
    throw ApiError.badRequest('Insufficient wallet balance');
  }

  user.walletBalance = type === 'credit' ? user.walletBalance + amount : user.walletBalance - amount;
  await user.save();

  const txn = await WalletTransaction.create({
    user: userId,
    type,
    amount,
    balanceAfter: user.walletBalance,
    reason,
    description,
    order,
  });

  return { user, transaction: txn };
};

/**
 * Credits or debits a user's reward points ledger.
 */
const applyRewardTransaction = async (userId, { type, points, reason, description = '', order = null }) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');

  if (type === 'redeemed' && user.rewardPoints < points) {
    throw ApiError.badRequest('Insufficient reward points');
  }

  user.rewardPoints = ['earned', 'adjusted'].includes(type) ? user.rewardPoints + points : user.rewardPoints - points;
  await user.save();

  const txn = await RewardTransaction.create({
    user: userId,
    type,
    points,
    balanceAfter: user.rewardPoints,
    reason,
    description,
    order,
  });

  return { user, transaction: txn };
};

/**
 * @route GET /api/v1/wallet
 */
const getWallet = asyncHandler(async (req, res) => {
  const transactions = await WalletTransaction.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
  return sendSuccess(res, 200, 'Wallet fetched', { balance: req.user.walletBalance, transactions });
});

/**
 * @route GET /api/v1/rewards
 */
const getRewards = asyncHandler(async (req, res) => {
  const transactions = await RewardTransaction.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
  return sendSuccess(res, 200, 'Reward points fetched', { balance: req.user.rewardPoints, transactions });
});

/**
 * @route POST /api/v1/admin/wallet/:userId/credit
 * Body: { amount, description }
 */
const adminCreditWallet = asyncHandler(async (req, res) => {
  const { amount, description = 'Wallet credited by admin' } = req.body;
  if (!amount || amount <= 0) throw ApiError.badRequest('Amount must be greater than zero');

  const { user, transaction } = await applyWalletTransaction(req.params.userId, {
    type: 'credit',
    amount,
    reason: 'admin_credit',
    description,
  });

  await notifyUser(user._id, {
    type: 'system',
    title: 'Wallet Credited',
    message: `₹${amount} has been credited to your wallet.`,
    link: '/dashboard/wallet',
  });

  return sendSuccess(res, 200, 'Wallet credited successfully', { balance: user.walletBalance, transaction });
});

/**
 * @route POST /api/v1/admin/rewards/:userId/adjust
 * Body: { points, description } — positive points adds, negative subtracts (as 'adjusted')
 */
const adminAdjustRewards = asyncHandler(async (req, res) => {
  const { points, description = 'Adjusted by admin' } = req.body;
  if (!points) throw ApiError.badRequest('Points value is required');

  const user = await User.findById(req.params.userId);
  if (!user) throw ApiError.notFound('User not found');

  user.rewardPoints = Math.max(0, user.rewardPoints + points);
  await user.save();

  const transaction = await RewardTransaction.create({
    user: user._id,
    type: 'adjusted',
    points,
    balanceAfter: user.rewardPoints,
    reason: 'admin_adjustment',
    description,
  });

  return sendSuccess(res, 200, 'Reward points adjusted', { balance: user.rewardPoints, transaction });
});

module.exports = {
  applyWalletTransaction,
  applyRewardTransaction,
  getWallet,
  getRewards,
  adminCreditWallet,
  adminAdjustRewards,
};
