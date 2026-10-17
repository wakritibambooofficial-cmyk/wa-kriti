const express = require('express');
const { getBlogs, getBlogBySlug, addComment, getBlogCategories } = require('../controllers/blogController');
const { protect } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { z } = require('zod');

const router = express.Router();

router.get('/', getBlogs);
router.get('/categories', getBlogCategories);
router.get('/:slug', getBlogBySlug);
router.post(
  '/:slug/comments',
  protect,
  validateRequest(z.object({ comment: z.string().trim().min(1, 'Comment cannot be empty') })),
  addComment
);

module.exports = router;
