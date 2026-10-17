const mongoose = require('mongoose');

const walletTransactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['credit', 'debit'], required: true },
    amount: { type: Number, required: true, min: 0 },
    balanceAfter: { type: Number, required: true },
    reason: {
      type: String,
      enum: ['refund', 'admin_credit', 'order_payment', 'referral_bonus', 'cashback', 'other'],
      required: true,
    },
    description: { type: String, default: '' },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
  },
  { timestamps: true }
);

const rewardTransactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['earned', 'redeemed', 'expired', 'adjusted'], required: true },
    points: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    reason: {
      type: String,
      enum: ['registration', 'purchase', 'review', 'referral', 'festival_campaign', 'redemption', 'admin_adjustment'],
      required: true,
    },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = {
  WalletTransaction: mongoose.model('WalletTransaction', walletTransactionSchema),
  RewardTransaction: mongoose.model('RewardTransaction', rewardTransactionSchema),
};
