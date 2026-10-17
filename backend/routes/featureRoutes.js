const express = require('express');

const {
  getFeatures,
  getAllFeatures,
  createFeature,
  updateFeature,
  deleteFeature,
} = require('../controllers/featureController');

const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

/* ---------- Public Route ---------- */

// Get active homepage features
router.get('/', getFeatures);

/* ---------- Admin Routes ---------- */

router.get('/admin', protect, restrictTo('admin'), getAllFeatures);

router.post('/admin', protect, restrictTo('admin'), createFeature);

router.put('/admin/:id', protect, restrictTo('admin'), updateFeature);

router.delete('/admin/:id', protect, restrictTo('admin'), deleteFeature);

module.exports = router;