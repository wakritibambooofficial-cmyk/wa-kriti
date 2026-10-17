const mongoose = require('mongoose');

const productQuestionSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    question: { type: String, required: true, trim: true },
    answer: { type: String, default: null },
    answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    answeredAt: { type: Date, default: null }, 
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productQuestionSchema.index({ product: 1, createdAt: -1 });
 
module.exports = mongoose.model('ProductQuestion', productQuestionSchema);
 