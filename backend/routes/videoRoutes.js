const express = require('express');

const {
  getVideos,
  getAllVideos,
  createVideo,
  updateVideo,
  deleteVideo,
} = require('../controllers/videoController');

const { protect, restrictTo } = require('../middlewares/authMiddleware');
const { videoUpload } = require('../config/cloudinary');

const router = express.Router();

/* ---------- Public Route ---------- */

// Get active homepage showcase videos
router.get('/', getVideos);

/* ---------- Admin Routes ---------- */

router.get('/admin', protect, restrictTo('admin'), getAllVideos);

router.post('/admin', protect, restrictTo('admin'), videoUpload.single('video'), createVideo);

router.put('/admin/:id', protect, restrictTo('admin'), videoUpload.single('video'), updateVideo);

router.delete('/admin/:id', protect, restrictTo('admin'), deleteVideo);

module.exports = router;