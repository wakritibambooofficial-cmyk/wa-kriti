const express = require('express');
const {
  trackRecentlyViewed,
  getRecentlyViewed,
  trackSearch,
  getRecentSearches,
  getPopularSearches,
  subscribeStockAlert,
} = require('../controllers/engagementController');
const { protect, optionalAuth } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { trackSearchSchema, stockAlertSchema } = require('../validators/growthValidators');

const router = express.Router();

// Guest-or-logged-in endpoints
router.post('/search-history', optionalAuth, validateRequest(trackSearchSchema), trackSearch);
router.get('/search-history/recent', optionalAuth, getRecentSearches);
router.get('/search-history/popular', getPopularSearches);
router.post('/stock-alerts', optionalAuth, validateRequest(stockAlertSchema), subscribeStockAlert);

// Logged-in only
router.post('/recently-viewed/:productId', protect, trackRecentlyViewed);
router.get('/recently-viewed', protect, getRecentlyViewed);

module.exports = router;
