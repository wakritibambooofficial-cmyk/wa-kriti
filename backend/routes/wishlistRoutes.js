const express = require('express');
const { z } = require('zod');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  moveToCart,
  mergeGuestWishlist,
} = require('../controllers/wishlistController');
const { protect } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID');
const addWishlistSchema = z.object({ productId: objectId });
const mergeWishlistSchema = z.object({ productIds: z.array(objectId).default([]) });

const router = express.Router();
router.use(protect);

router.get('/', getWishlist);
router.post('/items', validateRequest(addWishlistSchema), addToWishlist);
router.delete('/items/:productId', removeFromWishlist);
router.post('/items/:productId/move-to-cart', moveToCart);
router.post('/merge', validateRequest(mergeWishlistSchema), mergeGuestWishlist);

module.exports = router;
