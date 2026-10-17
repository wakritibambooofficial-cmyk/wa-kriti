// const express = require('express');
// const {
//   getCart,
//   addItemToCart,
//   updateCartItem,
//   removeCartItem,
//   toggleSaveForLater,
//   clearCart,
//   mergeGuestCart,
//   applyCoupon,
//   removeCoupon,
// } = require('../controllers/cartController');
// const { protect } = require('../middlewares/authMiddleware');
// const validateRequest = require('../middlewares/validateRequest');
// const {
//   addCartItemSchema, 
//   updateCartItemSchema,
//   mergeCartSchema,
//   applyCouponSchema,
// } = require('../validators/cartValidators');

// const router = express.Router();

// router.use(protect);

// router.get('/', getCart);
// router.post('/items', validateRequest(addCartItemSchema), addItemToCart);
// router.put('/items/:itemId', validateRequest(updateCartItemSchema), updateCartItem);
// router.delete('/items/:itemId', removeCartItem);
// router.patch('/items/:itemId/save-for-later', toggleSaveForLater);
// router.delete('/', clearCart);
// router.post('/merge', validateRequest(mergeCartSchema), mergeGuestCart);
// router.post('/coupon', validateRequest(applyCouponSchema), applyCoupon);
// router.delete('/coupon', removeCoupon);

// module.exports = router;



const express = require('express');
const {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  toggleSaveForLater,
  clearCart,
  mergeGuestCart,
  applyCoupon,
  removeCoupon,
  applyRewardPoints,
  removeRewardPoints,
} = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const {
  addCartItemSchema,
  updateCartItemSchema,
  mergeCartSchema,
  applyCouponSchema,
} = require('../validators/cartValidators');

const router = express.Router();

router.use(protect);

router.get('/', getCart);
router.post('/items', validateRequest(addCartItemSchema), addItemToCart);
router.put('/items/:itemId', validateRequest(updateCartItemSchema), updateCartItem);
router.delete('/items/:itemId', removeCartItem);
router.patch('/items/:itemId/save-for-later', toggleSaveForLater);
router.delete('/', clearCart);
router.post('/merge', validateRequest(mergeCartSchema), mergeGuestCart);
router.post('/coupon', validateRequest(applyCouponSchema), applyCoupon);
router.delete('/coupon', removeCoupon);
// router.post('/reward', applyRewardPoints);
// router.delete('/reward', removeRewardPoints);

module.exports = router;