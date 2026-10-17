const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const membershipTierSchema = new mongoose.Schema(
  {
    tier: { type: String, enum: ['basic', 'silver', 'gold', 'premium'], required: true, unique: true },
    minSpend: { type: Number, required: true, default: 0 }, // lifetime spend required to reach this tier
    discountPercentage: { type: Number, default: 0 },
    freeShipping: { type: Boolean, default: false },
    earlyAccess: { type: Boolean, default: false },
    rewardPointsMultiplier: { type: Number, default: 1 },
    perks: [{ type: String }],
  },
  { timestamps: true }
);

const referralSchema = new mongoose.Schema(
  {
    referrer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    code: { type: String, unique: true, required: true },
    referredUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    referredEmail: { type: String, default: null },
    status: { type: String, enum: ['pending', 'signed_up', 'first_order_completed', 'rewarded'], default: 'pending' },
    rewardPointsGranted: { type: Number, default: 0 },
    walletCreditGranted: { type: Number, default: 0 },
  },
  { timestamps: true }
);

referralSchema.statics.generateCode = function (firstName) {
  const base = (firstName || 'WAK').substring(0, 4).toUpperCase();
  return `${base}${nanoid(5).toUpperCase()}`;
};

module.exports = {
  MembershipTier: mongoose.model('MembershipTier', membershipTierSchema),
  Referral: mongoose.model('Referral', referralSchema),
};
