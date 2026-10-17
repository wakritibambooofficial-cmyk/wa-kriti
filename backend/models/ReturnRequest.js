const mongoose = require('mongoose');

const returnRequestSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    orderItemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['return', 'exchange'], required: true },
    reason: {
      type: String,
      enum: ['wrong_product', 'damaged_product', 'defective', 'quality_issue', 'changed_mind', 'other'],
      required: true,
    },
    description: { type: String, default: '' },
    images: [{ url: String, publicId: String }],
    exchangeVariantId: { type: mongoose.Schema.Types.ObjectId, default: null }, // for exchange requests
    status: {
      type: String,
      enum: ['requested', 'approved', 'rejected', 'completed'],
      default: 'requested',
    },
    refundType: { type: String, enum: ['full', 'partial', null], default: null },
    refundAmount: { type: Number, default: 0 },
    adminNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ReturnRequest', returnRequestSchema);
