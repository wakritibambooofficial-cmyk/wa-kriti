const express = require('express');

const {
  getVideoShowcases,
  getAllVideoShowcases,
  createVideoShowcase,
  updateVideoShowcase,
  deleteVideoShowcase,
} = require('../controllers/videoShowcaseController');

const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

/* ---------- Public Route ---------- */

// Get active homepage video showcase block(s)
router.get('/', getVideoShowcases);

/* ---------- Admin Routes ---------- */

router.get('/admin', protect, restrictTo('admin'), getAllVideoShowcases);

router.post('/admin', protect, restrictTo('admin'), createVideoShowcase);

router.put('/admin/:id', protect, restrictTo('admin'), updateVideoShowcase);

router.delete('/admin/:id', protect, restrictTo('admin'), deleteVideoShowcase);

module.exports = router;