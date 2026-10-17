const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variantId: { type: mongoose.Schema.Types.ObjectId, default: null },
    name: { type: String, required: true },
    image: { type: String, default: null },
    sku: { type: String, default: null },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true },
  }, 
  { _id: true }
); 

const timelineEventSchema = new mongoose.Schema(
  { 
    status: { type: String, required: true },
    description: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, index: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    items: [orderItemSchema],

    shippingAddress: {
      fullName: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      landmark: String,
      city: String,
      state: String,
      country: String,
      pincode: String,
    },
    billingAddress: {
      fullName: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      landmark: String,
      city: String,
      state: String,
      country: String,
      pincode: String,
    },

    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    couponCode: { type: String, default: null },
    walletAmountUsed: { type: Number, default: 0 },
    rewardPointsRedeemed: { type: Number, default: 0 },
    rewardPointsDiscount: { type: Number, default: 0 },
    rewardPointsAwarded: { type: Boolean, default: false },
    tax: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },

    paymentMethod: { type: String, enum: ['razorpay', 'cod', 'wallet'], default: 'razorpay' },
    paymentStatus: {
      type: String,
      enum: ['pending', 'processing', 'paid', 'failed', 'refunded', 'cancelled'],
      default: 'pending',
    },
    razorpayOrderId: { type: String, default: null },
    razorpayPaymentId: { type: String, default: null },
    razorpaySignature: { type: String, default: null },

    orderStatus: {
      type: String,
      enum: [
        'placed',
        'confirmed',
        'packed',
        'shipped',
        'out_for_delivery',
        'delivered',
        'cancelled',
        'returned',
        'refunded',
        'exchange_requested',
        'exchange_approved',
        'exchange_completed',
      ],
      default: 'placed',
    },
    timeline: [timelineEventSchema],

    trackingNumber: { type: String, default: null },
    shippingPartner: { type: String, default: null },

    notes: { type: String, default: '' },
    giftWrap: { type: Boolean, default: false },
    giftMessage: { type: String, default: '' },

    cancelReason: { type: String, default: null },
    cancelledAt: { type: Date, default: null },
  },
  { timestamps: true }
);

orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });

orderSchema.pre('validate', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = `WAK${Date.now().toString().slice(-8)}${nanoid(4).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
