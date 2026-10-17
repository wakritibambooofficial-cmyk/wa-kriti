// const Review = require('../models/Review');
// const Order = require('../models/Order');
// const Product = require('../models/Product');
// const asyncHandler = require('../utils/asyncHandler');
// const ApiError = require('../utils/ApiError');
// const { sendSuccess } = require('../utils/apiResponse');
// const { uploadBufferToCloudinary } = require('../config/cloudinary');

// const recalculateProductRating = async (productId) => {
//   const stats = await Review.aggregate([
//     { $match: { product: productId, status: 'approved' } },
//     { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
//   ]);

//   const { avgRating = 0, count = 0 } = stats[0] || {}; 
//   await Product.findByIdAndUpdate(productId, {
//     ratingsAverage: Math.round(avgRating * 10) / 10,
//     ratingsCount: count,
//   });
// };

// /**
//  * @route GET /api/v1/reviews/product/:productId
//  * Public. Only approved reviews are shown.
//  */
// const getProductReviews = asyncHandler(async (req, res) => {
//   const page = Math.max(1, parseInt(req.query.page, 10) || 1);
//   const limit = Math.min(50, parseInt(req.query.limit, 10) || 10);

//   const filter = { product: req.params.productId, status: 'approved' };

//   const [reviews, total, distribution] = await Promise.all([
//     Review.find(filter)
//       .populate('user', 'firstName lastName avatar')
//       .sort({ isFeatured: -1, createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit),
//     Review.countDocuments(filter),
//     Review.aggregate([{ $match: filter }, { $group: { _id: '$rating', count: { $sum: 1 } } }]),
//   ]);

//   const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
//   distribution.forEach((d) => {
//     ratingDistribution[d._id] = d.count;
//   });

//   return sendSuccess(
//     res,
//     200,
//     'Reviews fetched',
//     { reviews, ratingDistribution },
//     { page, limit, total, totalPages: Math.ceil(total / limit) }
//   );
// });

// /**
//  * @route POST /api/v1/reviews/product/:productId
//  * Protected. Verified-purchase flag set automatically if a delivered order exists.
//  */
// const createReview = asyncHandler(async (req, res) => {
//   const { productId } = req.params;
//   const { rating, title = '', description = '' } = req.body;

//   const product = await Product.findById(productId);
//   if (!product) throw ApiError.notFound('Product not found');

//   const existingReview = await Review.findOne({ product: productId, user: req.user._id });
//   if (existingReview) throw ApiError.conflict('You have already reviewed this product');

//   const deliveredOrder = await Order.findOne({
//     customer: req.user._id,
//     orderStatus: 'delivered',
//     'items.product': productId,
//   });

//   let images = [];
//   if (req.files?.length) {
//     const uploads = await Promise.all(req.files.map((f) => uploadBufferToCloudinary(f.buffer, 'reviews')));
//     images = uploads.map((u) => ({ url: u.url, publicId: u.publicId }));
//   }

//   const review = await Review.create({
//     product: productId,
//     user: req.user._id,
//     order: deliveredOrder?._id || null,
//     rating,
//     title,
//     description,
//     images,
//     isVerifiedPurchase: Boolean(deliveredOrder),
//     status: 'pending',
//   });

//   return sendSuccess(res, 201, 'Review submitted successfully. It will be visible after approval.', { review });
// });

// /**
//  * @route PUT /api/v1/reviews/:id
//  */
// const updateReview = asyncHandler(async (req, res) => {
//   const review = await Review.findOne({ _id: req.params.id, user: req.user._id });
//   if (!review) throw ApiError.notFound('Review not found');

//   const { rating, title, description } = req.body;
//   if (rating) review.rating = rating;
//   if (title !== undefined) review.title = title;
//   if (description !== undefined) review.description = description;
//   review.status = 'pending';
//   await review.save();

//   return sendSuccess(res, 200, 'Review updated. It will be re-reviewed by our team.', { review });
// });

// /**
//  * @route DELETE /api/v1/reviews/:id
//  */
// const deleteReview = asyncHandler(async (req, res) => {
//   const review = await Review.findOne({ _id: req.params.id, user: req.user._id });
//   if (!review) throw ApiError.notFound('Review not found');

//   await review.deleteOne();
//   await recalculateProductRating(review.product);

//   return sendSuccess(res, 200, 'Review deleted successfully');
// });

// /**
//  * @route POST /api/v1/reviews/:id/helpful
//  */
// const toggleHelpful = asyncHandler(async (req, res) => {
//   const review = await Review.findById(req.params.id);
//   if (!review) throw ApiError.notFound('Review not found');

//   const alreadyVoted = review.helpfulUsers.some((id) => id.toString() === req.user._id.toString());
//   if (alreadyVoted) {
//     review.helpfulUsers = review.helpfulUsers.filter((id) => id.toString() !== req.user._id.toString());
//     review.helpfulCount = Math.max(0, review.helpfulCount - 1);
//   } else {
//     review.helpfulUsers.push(req.user._id);
//     review.helpfulCount += 1;
//   }
//   await review.save();

//   return sendSuccess(res, 200, 'Vote recorded', { helpfulCount: review.helpfulCount, voted: !alreadyVoted });
// });

// /**
//  * @route GET /api/v1/admin/reviews
//  */
// const getAllReviewsAdmin = asyncHandler(async (req, res) => {
//   const { status } = req.query;
//   const filter = {};
//   if (status) filter.status = status;

//   const reviews = await Review.find(filter)
//     .populate('user', 'firstName lastName email')
//     .populate('product', 'name slug')
//     .sort({ createdAt: -1 });

//   return sendSuccess(res, 200, 'Reviews fetched', { reviews });
// });

// /**
//  * @route PATCH /api/v1/admin/reviews/:id/status
//  */
// const moderateReview = asyncHandler(async (req, res) => {
//   const { status } = req.body;
//   const review = await Review.findById(req.params.id);
//   if (!review) throw ApiError.notFound('Review not found');

//   const wasApprovedBefore = review.status === 'approved';
//   review.status = status;
//   await review.save();
//   await recalculateProductRating(review.product);

//   if (status === 'approved' && !wasApprovedBefore) {
//     const { applyRewardTransaction } = require('./loyaltyController');
//     const REVIEW_REWARD_POINTS = 20;
//     applyRewardTransaction(review.user, {
//       type: 'earned',
//       points: REVIEW_REWARD_POINTS,
//       reason: 'review',
//       description: 'Reward for an approved product review',
//     }).catch(() => {});
//   }

//   return sendSuccess(res, 200, `Review ${status}`, { review });
// });

// /**
//  * @route POST /api/v1/admin/reviews/:id/reply
//  */
// const replyToReview = asyncHandler(async (req, res) => {
//   const { message } = req.body;
//   const review = await Review.findById(req.params.id);
//   if (!review) throw ApiError.notFound('Review not found');

//   review.adminReply = { message, repliedAt: new Date(), repliedBy: req.user._id };
//   await review.save();

//   return sendSuccess(res, 200, 'Reply posted', { review });
// });

// /**
//  * @route DELETE /api/v1/admin/reviews/:id
//  */
// const adminDeleteReview = asyncHandler(async (req, res) => {
//   const review = await Review.findById(req.params.id);
//   if (!review) throw ApiError.notFound('Review not found');

//   await review.deleteOne();
//   await recalculateProductRating(review.product);

//   return sendSuccess(res, 200, 'Review deleted successfully');
// });

// module.exports = {
//   getProductReviews,
//   createReview,
//   updateReview,
//   deleteReview,
//   toggleHelpful,
//   getAllReviewsAdmin,
//   moderateReview,
//   replyToReview,
//   adminDeleteReview,
// };



const mongoose = require('mongoose');
const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');
const { uploadBufferToCloudinary } = require('../config/cloudinary');

const recalculateProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId, status: 'approved' } },
    { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  const { avgRating = 0, count = 0 } = stats[0] || {}; 
  await Product.findByIdAndUpdate(productId, {
    ratingsAverage: Math.round(avgRating * 10) / 10,
    ratingsCount: count,
  });
};

/**
 * @route GET /api/v1/reviews/product/:productId
 * Public. Only approved reviews are shown.
 */
const getProductReviews = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, parseInt(req.query.limit, 10) || 10);

  if (!mongoose.isValidObjectId(req.params.productId)) throw ApiError.notFound('Product not found');

  // aggregate() does not cast strings to ObjectId, so cast explicitly
  const filter = { product: new mongoose.Types.ObjectId(req.params.productId), status: 'approved' };

  const [reviews, total, distribution] = await Promise.all([
    Review.find(filter)
      .populate('user', 'firstName lastName avatar')
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Review.countDocuments(filter),
    Review.aggregate([{ $match: filter }, { $group: { _id: '$rating', count: { $sum: 1 } } }]),
  ]);

  const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  distribution.forEach((d) => {
    ratingDistribution[d._id] = d.count;
  });

  return sendSuccess(
    res,
    200,
    'Reviews fetched',
    { reviews, ratingDistribution },
    { page, limit, total, totalPages: Math.ceil(total / limit) }
  );
});

/**
 * @route GET /api/v1/reviews/mine
 * Protected. All of the logged-in user's reviews, any status.
 */
const getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ user: req.user._id })
    .select('-helpfulUsers')
    .populate('product', 'name slug images')
    .sort({ createdAt: -1 });

  return sendSuccess(res, 200, 'Your reviews fetched', { reviews });
});

/**
 * @route POST /api/v1/reviews/product/:productId
 * Protected. Verified-purchase flag set automatically if a delivered order exists.
 */
const createReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { rating, title = '', description = '' } = req.body;

  const product = await Product.findById(productId);
  if (!product) throw ApiError.notFound('Product not found');

  const existingReview = await Review.findOne({ product: productId, user: req.user._id });
  if (existingReview) throw ApiError.conflict('You have already reviewed this product');

  const deliveredOrder = await Order.findOne({
    customer: req.user._id,
    orderStatus: 'delivered',
    'items.product': productId,
  });

  let images = [];
  if (req.files?.length) {
    const uploads = await Promise.all(req.files.map((f) => uploadBufferToCloudinary(f.buffer, 'reviews')));
    images = uploads.map((u) => ({ url: u.url, publicId: u.publicId }));
  }

  const review = await Review.create({
    product: productId,
    user: req.user._id,
    order: deliveredOrder?._id || null,
    rating,
    title,
    description,
    images,
    isVerifiedPurchase: Boolean(deliveredOrder),
    status: 'pending',
  });

  return sendSuccess(res, 201, 'Review submitted successfully. It will be visible after approval.', { review });
});

/**
 * @route PUT /api/v1/reviews/:id
 */
const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id, user: req.user._id });
  if (!review) throw ApiError.notFound('Review not found');

  const { rating, title, description } = req.body;
  if (rating) review.rating = rating;
  if (title !== undefined) review.title = title;
  if (description !== undefined) review.description = description;
  review.status = 'pending';
  await review.save();
  await recalculateProductRating(review.product);

  return sendSuccess(res, 200, 'Review updated. It will be re-reviewed by our team.', { review });
});

/**
 * @route DELETE /api/v1/reviews/:id
 */
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id, user: req.user._id });
  if (!review) throw ApiError.notFound('Review not found');

  await review.deleteOne();
  await recalculateProductRating(review.product);

  return sendSuccess(res, 200, 'Review deleted successfully');
});

/**
 * @route POST /api/v1/reviews/:id/helpful
 */
const toggleHelpful = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw ApiError.notFound('Review not found');

  const alreadyVoted = review.helpfulUsers.some((id) => id.toString() === req.user._id.toString());
  if (alreadyVoted) {
    review.helpfulUsers = review.helpfulUsers.filter((id) => id.toString() !== req.user._id.toString());
    review.helpfulCount = Math.max(0, review.helpfulCount - 1);
  } else {
    review.helpfulUsers.push(req.user._id);
    review.helpfulCount += 1;
  }
  await review.save();

  return sendSuccess(res, 200, 'Vote recorded', { helpfulCount: review.helpfulCount, voted: !alreadyVoted });
});

/**
 * @route GET /api/v1/admin/reviews
 */
const getAllReviewsAdmin = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const reviews = await Review.find(filter)
    .populate('user', 'firstName lastName email')
    .populate('product', 'name slug')
    .sort({ createdAt: -1 });

  return sendSuccess(res, 200, 'Reviews fetched', { reviews });
});

/**
 * @route PATCH /api/v1/admin/reviews/:id/status
 */
const moderateReview = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const review = await Review.findById(req.params.id);
  if (!review) throw ApiError.notFound('Review not found');

  const wasApprovedBefore = review.status === 'approved';
  review.status = status;
  await review.save();
  await recalculateProductRating(review.product);

  if (status === 'approved' && !wasApprovedBefore) {
    const { applyRewardTransaction } = require('./loyaltyController');
    const REVIEW_REWARD_POINTS = 20;
    applyRewardTransaction(review.user, {
      type: 'earned',
      points: REVIEW_REWARD_POINTS,
      reason: 'review',
      description: 'Reward for an approved product review',
    }).catch(() => {});
  }

  return sendSuccess(res, 200, `Review ${status}`, { review });
});

/**
 * @route POST /api/v1/admin/reviews/:id/reply
 */
const replyToReview = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const review = await Review.findById(req.params.id);
  if (!review) throw ApiError.notFound('Review not found');

  review.adminReply = { message, repliedAt: new Date(), repliedBy: req.user._id };
  await review.save();

  return sendSuccess(res, 200, 'Reply posted', { review });
});

/**
 * @route DELETE /api/v1/admin/reviews/:id
 */
const adminDeleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw ApiError.notFound('Review not found');

  await review.deleteOne();
  await recalculateProductRating(review.product);

  return sendSuccess(res, 200, 'Review deleted successfully');
});

module.exports = {
  getProductReviews,
  getMyReviews,
  createReview,
  updateReview,
  deleteReview,
  toggleHelpful,
  getAllReviewsAdmin,
  moderateReview,
  replyToReview,
  adminDeleteReview,
};