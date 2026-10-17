const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variantId: { type: mongoose.Schema.Types.ObjectId, default: null },
    frequency: { type: String, enum: ['monthly', 'quarterly', 'yearly'], required: true },
    quantity: { type: Number, default: 1, min: 1 },
    discountPercentage: { type: Number, default: 5 }, // subscription discount vs one-time purchase
    shippingAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    status: { type: String, enum: ['active', 'paused', 'cancelled'], default: 'active' },
    nextDeliveryDate: { type: Date, required: true },
    lastOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
    totalDeliveries: { type: Number, default: 0 },
  },
  { timestamps: true }
);

subscriptionSchema.index({ status: 1, nextDeliveryDate: 1 });

const FREQUENCY_DAYS = { monthly: 30, quarterly: 90, yearly: 365 };

subscriptionSchema.methods.advanceNextDelivery = function () {
  const days = FREQUENCY_DAYS[this.frequency] || 30;
  this.nextDeliveryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  this.totalDeliveries += 1;
};

module.exports = mongoose.model('Subscription', subscriptionSchema);
