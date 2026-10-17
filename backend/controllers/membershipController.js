const User = require('../models/User');
const { MembershipTier, Referral } = require('../models/Membership');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');
const { applyRewardTransaction } = require('./loyaltyController');
const { notifyUser } = require('../services/notificationService');

const DEFAULT_TIERS = [
  { tier: 'basic', minSpend: 0, discountPercentage: 0, freeShipping: false, earlyAccess: false, rewardPointsMultiplier: 1 },
  { tier: 'silver', minSpend: 5000, discountPercentage: 3, freeShipping: false, earlyAccess: false, rewardPointsMultiplier: 1.25 },
  { tier: 'gold', minSpend: 15000, discountPercentage: 5, freeShipping: true, earlyAccess: true, rewardPointsMultiplier: 1.5 },
  { tier: 'premium', minSpend: 30000, discountPercentage: 8, freeShipping: true, earlyAccess: true, rewardPointsMultiplier: 2 },
];

/**
 * Ensures the four default membership tiers exist (seeded lazily on first read).
 */
const ensureTiersSeeded = async () => {
  const count = await MembershipTier.countDocuments();
  if (count === 0) await MembershipTier.insertMany(DEFAULT_TIERS);
};

/**
 * Recalculates and applies a user's membership tier based on lifetime spend.
 * Called after every successful (paid) order.
 */
const recalculateMembership = async (userId) => {
  await ensureTiersSeeded();
  const user = await User.findById(userId);
  if (!user) return;

  const tiers = await MembershipTier.find().sort({ minSpend: -1 });
  const eligibleTier = tiers.find((t) => user.lifetimeSpend >= t.minSpend) || tiers[tiers.length - 1];

  if (eligibleTier && user.membership !== eligibleTier.tier) {
    const upgraded = tiers.findIndex((t) => t.tier === eligibleTier.tier) < tiers.findIndex((t) => t.tier === user.membership);
    user.membership = eligibleTier.tier;
    await user.save();

    // if (upgraded) {
    //   await notifyUser(user._id, {
    //     type: 'membership',
    //     title: 'Membership Upgraded!',
    //     message: `Congratulations! You've been upgraded to ${eligibleTier.tier.toUpperCase()} membership.`,
    //     link: '/dashboard',
    //   });
    // }
  }
};

/**
 * @route GET /api/v1/membership/tiers
 * Public.
 */
const getMembershipTiers = asyncHandler(async (req, res) => {
  await ensureTiersSeeded();
  const tiers = await MembershipTier.find().sort({ minSpend: 1 });
  return sendSuccess(res, 200, 'Membership tiers fetched', { tiers });
});

/**
 * @route PUT /api/v1/admin/membership/tiers/:tier
 */
const updateMembershipTier = asyncHandler(async (req, res) => {
  const tier = await MembershipTier.findOneAndUpdate({ tier: req.params.tier }, req.body, { new: true, upsert: true });
  return sendSuccess(res, 200, 'Membership tier updated', { tier });
});

/* ------------------------------ Referrals ------------------------------ */

/**
 * @route GET /api/v1/referrals/my-code
 * Returns (and lazily generates) the current user's referral code.
 */
const getMyReferralCode = asyncHandler(async (req, res) => {
  let user = req.user;
  if (!user.referralCode) {
    let code;
    let exists = true;
    while (exists) {
      code = Referral.generateCode(user.firstName);
      // eslint-disable-next-line no-await-in-loop
      exists = await User.exists({ referralCode: code });
    }
    user.referralCode = code;
    await user.save();
  }

  const referrals = await Referral.find({ referrer: user._id }).sort({ createdAt: -1 });
  const stats = {
    totalReferred: referrals.length,
    rewarded: referrals.filter((r) => r.status === 'rewarded').length,
    pending: referrals.filter((r) => r.status !== 'rewarded').length,
  };

  return sendSuccess(res, 200, 'Referral code fetched', { referralCode: user.referralCode, referrals, stats });
});

/**
 * @route POST /api/v1/referrals/apply
 * Body: { code } — applied during signup flow (called right after signup/verification).
 */
const applyReferralCode = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const referrer = await User.findOne({ referralCode: code.toUpperCase() });
  if (!referrer) throw ApiError.badRequest('Invalid referral code');
  if (referrer._id.toString() === req.user._id.toString()) throw ApiError.badRequest('You cannot refer yourself');
  if (req.user.referredBy) throw ApiError.conflict('A referral code has already been applied to your account');

  req.user.referredBy = referrer._id;
  await req.user.save();

  await Referral.create({
    referrer: referrer._id,
    code: code.toUpperCase(),
    referredUser: req.user._id,
    referredEmail: req.user.email,
    status: 'signed_up',
  });

  return sendSuccess(res, 200, 'Referral code applied successfully');
});

/**
 * Called from order finalization: if this is the referred user's first
 * paid order, reward the referrer with reward points + wallet credit.
 */
const processReferralReward = async (userId) => {
  const referral = await Referral.findOne({ referredUser: userId, status: { $ne: 'rewarded' } });
  if (!referral) return;

  const REFERRAL_POINTS = 200;
  const REFERRAL_WALLET_CREDIT = 100;

  await applyRewardTransaction(referral.referrer, {
    type: 'earned',
    points: REFERRAL_POINTS,
    reason: 'referral',
    description: 'Reward for successful referral',
  });

  const { applyWalletTransaction } = require('./loyaltyController');
  await applyWalletTransaction(referral.referrer, {
    type: 'credit',
    amount: REFERRAL_WALLET_CREDIT,
    reason: 'referral_bonus',
    description: 'Wallet bonus for successful referral',
  });

  referral.status = 'rewarded';
  referral.rewardPointsGranted = REFERRAL_POINTS;
  referral.walletCreditGranted = REFERRAL_WALLET_CREDIT;
  await referral.save();

  // await notifyUser(referral.referrer, {
  //   type: 'reward',
  //   title: 'Referral Reward Earned!',
  //   message: `You earned ${REFERRAL_POINTS} points and ₹${REFERRAL_WALLET_CREDIT} wallet credit for a successful referral.`,
  //   link: '/dashboard/rewards',
  // });
};

module.exports = {
  getMembershipTiers,
  updateMembershipTier,
  recalculateMembership,
  getMyReferralCode,
  applyReferralCode,
  processReferralReward,
};
