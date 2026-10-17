const { RecentlyViewed, SearchHistory, StockAlert } = require('../models/Engagement');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');
const { sendEmail } = require('../services/emailService');
const logger = require('../utils/logger');

const MAX_RECENTLY_VIEWED = 20;

const trackRecentlyViewed = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const exists = await Product.exists({ _id: productId });
  if (!exists) throw ApiError.notFound('Product not found');

  await RecentlyViewed.findOneAndUpdate(
    { user: req.user._id, product: productId },
    { viewedAt: new Date() },
    { upsert: true }
  );

  const all = await RecentlyViewed.find({ user: req.user._id }).sort({ viewedAt: -1 });
  if (all.length > MAX_RECENTLY_VIEWED) {
    const toRemove = all.slice(MAX_RECENTLY_VIEWED).map((r) => r._id);
    await RecentlyViewed.deleteMany({ _id: { $in: toRemove } });
  }

  return sendSuccess(res, 200, 'Tracked');
});

const getRecentlyViewed = asyncHandler(async (req, res) => {
  const records = await RecentlyViewed.find({ user: req.user._id })
    .sort({ viewedAt: -1 })
    .limit(MAX_RECENTLY_VIEWED)
    .populate({
      path: 'product',
      select: 'name slug images price comparePrice ratingsAverage ratingsCount status',
      match: { status: 'published', deletedAt: null },
    });

  const products = records.map((r) => r.product).filter(Boolean);
  return sendSuccess(res, 200, 'Recently viewed products fetched', { products });
});

const trackSearch = asyncHandler(async (req, res) => {
  const { keyword, resultCount = 0 } = req.body;
  if (!keyword || !keyword.trim()) return sendSuccess(res, 200, 'Skipped (empty keyword)');

  await SearchHistory.create({
    user: req.user ? req.user._id : null,
    sessionId: req.user ? null : req.headers['x-session-id'] || null,
    keyword: keyword.trim(),
    resultCount,
  });

  return sendSuccess(res, 201, 'Search tracked');
});

const getRecentSearches = asyncHandler(async (req, res) => {
  const filter = req.user ? { user: req.user._id } : { sessionId: req.headers['x-session-id'] || '__none__' };
  const records = await SearchHistory.find(filter).sort({ createdAt: -1 }).limit(30);

  const uniqueKeywords = [...new Set(records.map((r) => r.keyword))].slice(0, 10);
  return sendSuccess(res, 200, 'Recent searches fetched', { keywords: uniqueKeywords }); 
});

const getPopularSearches = asyncHandler(async (req, res) => {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const popular = await SearchHistory.aggregate([
    { $match: { createdAt: { $gte: since } } },
    { $group: { _id: '$keyword', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  return sendSuccess(res, 200, 'Popular searches fetched', { keywords: popular.map((p) => p._id) });
});

const subscribeStockAlert = asyncHandler(async (req, res) => {
  const { productId, variantId = null, email } = req.body;
  const product = await Product.findById(productId);
  if (!product) throw ApiError.notFound('Product not found');

  const resolvedEmail = email || (req.user ? req.user.email : null);
  if (!resolvedEmail) throw ApiError.badRequest('Email is required');

  await StockAlert.findOneAndUpdate(
    { product: productId, variantId, email: resolvedEmail },
    { user: req.user ? req.user._id : null, notified: false, notifiedAt: null },
    { upsert: true, setDefaultsOnInsert: true }
  );

  return sendSuccess(res, 201, "We'll notify you as soon as this product is back in stock!");
});

const triggerStockAlerts = async (productId, variantId = null) => {
  const alerts = await StockAlert.find({ product: productId, variantId, notified: false });
  if (!alerts.length) return;

  const product = await Product.findById(productId);
  if (!product) return;

  for (const alert of alerts) {
    // eslint-disable-next-line no-await-in-loop
    await sendEmail({
      to: alert.email,
      subject: `${product.name} is back in stock!`,
      html: `<p>Good news! <strong>${product.name}</strong> is back in stock. Grab it before it sells out again.</p>
             <p><a href="${process.env.CLIENT_URL}/product/${product.slug}">Shop Now</a></p>`,
    }).catch((e) => logger.error(`Stock alert email failed: ${e.message}`));

    alert.notified = true;
    alert.notifiedAt = new Date();
    // eslint-disable-next-line no-await-in-loop
    await alert.save();
  }
};

module.exports = {
  trackRecentlyViewed,
  getRecentlyViewed,
  trackSearch,
  getRecentSearches,
  getPopularSearches,
  subscribeStockAlert,
  triggerStockAlerts,
};
