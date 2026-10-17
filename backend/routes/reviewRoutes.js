// const express = require('express');
// const {
//   getProductReviews,
//   createReview, 
//   updateReview,
//   deleteReview,
//   toggleHelpful,
// } = require('../controllers/reviewController');
// const { protect } = require('../middlewares/authMiddleware');
// const validateRequest = require('../middlewares/validateRequest');
// const { createReviewSchema, updateReviewSchema } = require('../validators/engagementValidators');
// const { memoryUpload } = require('../config/cloudinary');

// const router = express.Router();
// const reviewImages = memoryUpload.array('images', 5);

// router.get('/product/:productId', getProductReviews);

// router.use(protect);
// router.post('/product/:productId', reviewImages, validateRequest(createReviewSchema), createReview);
// router.put('/:id', validateRequest(updateReviewSchema), updateReview);
// router.delete('/:id', deleteReview);
// router.post('/:id/helpful', toggleHelpful);

// module.exports = router;


const express = require('express');
const {
  getProductReviews,
  getMyReviews,
  createReview,
  updateReview,
  deleteReview,
  toggleHelpful,
} = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { createReviewSchema, updateReviewSchema } = require('../validators/engagementValidators');
const { memoryUpload } = require('../config/cloudinary');

const router = express.Router();
const reviewImages = memoryUpload.array('images', 5);

router.get('/product/:productId', getProductReviews);

router.use(protect);
router.get('/mine', getMyReviews);
router.post('/product/:productId', reviewImages, validateRequest(createReviewSchema), createReview);
router.put('/:id', validateRequest(updateReviewSchema), updateReview);
router.delete('/:id', deleteReview);
router.post('/:id/helpful', toggleHelpful);

module.exports = router;