const express = require('express');
const router = express.Router();
const {
  getTestimonials,
  getMyTestimonials,
  submitTestimonial,
  updateMyTestimonial,
  deleteMyTestimonial,
  getAllTestimonialsAdmin,
  approveTestimonial,
  rejectTestimonial,
  createTestimonialAdmin,
  deleteTestimonialAdmin,
} = require('../controllers/testimonialController');

// Adjust these to match whatever auth middleware your project already
// uses (e.g. the same ones used in your existing orderRoutes/productRoutes).
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Public
router.get('/', getTestimonials);

// Logged-in customer — manage their own testimonials
router.get('/mine', protect, getMyTestimonials);
router.post('/', protect, submitTestimonial);
router.put('/:id', protect, updateMyTestimonial);
router.delete('/:id', protect, deleteMyTestimonial);

// Admin — moderation
router.get('/admin/all', protect, restrictTo('admin'), getAllTestimonialsAdmin);
router.patch('/admin/:id/approve', protect, restrictTo('admin'), approveTestimonial);
router.patch('/admin/:id/reject', protect, restrictTo('admin'), rejectTestimonial);
router.post('/admin', protect, restrictTo('admin'), createTestimonialAdmin);
router.delete('/admin/:id', protect, restrictTo('admin'), deleteTestimonialAdmin);

module.exports = router;