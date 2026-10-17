const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String, default: null },
    price: { type: Number, required: true },
    slug: { type: String, default: null },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const wishlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    items: [wishlistItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Wishlist', wishlistSchema);
