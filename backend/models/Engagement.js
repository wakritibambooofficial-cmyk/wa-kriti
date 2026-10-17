const mongoose = require('mongoose');

const recentlyViewedSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    viewedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

recentlyViewedSchema.index({ user: 1, product: 1 }, { unique: true });
recentlyViewedSchema.index({ user: 1, viewedAt: -1 });

const searchHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    sessionId: { type: String, default: null, index: true }, // for guest search history
    keyword: { type: String, required: true, trim: true, lowercase: true },
    resultCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

searchHistorySchema.index({ keyword: 1 });

const stockAlertSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    variantId: { type: mongoose.Schema.Types.ObjectId, default: null },
    email: { type: String, required: true, trim: true, lowercase: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    notified: { type: Boolean, default: false },
    notifiedAt: { type: Date, default: null },
  },
  { timestamps: true }
); 

stockAlertSchema.index({ product: 1, email: 1, variantId: 1 }, { unique: true });

module.exports = {
  RecentlyViewed: mongoose.model('RecentlyViewed', recentlyViewedSchema),
  SearchHistory: mongoose.model('SearchHistory', searchHistorySchema),
  StockAlert: mongoose.model('StockAlert', stockAlertSchema),
};
