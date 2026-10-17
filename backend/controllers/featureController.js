const Feature = require('../models/Feature');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');
 
/**
 * @desc Get all active features (Public)
 * @route GET /api/v1/features
 */
exports.getFeatures = asyncHandler(async (req, res) => {
  const features = await Feature.find({ status: 'active' }).sort({ order: 1 });

  return sendSuccess(res, 200, 'Features fetched successfully', {
    features,
  });
});

/**
 * @desc Get all features (Admin)
 * @route GET /api/v1/admin/features
 */
exports.getAllFeatures = asyncHandler(async (req, res) => {
  const features = await Feature.find().sort({ order: 1 });

  return sendSuccess(res, 200, 'Features fetched successfully', {
    features,
  });
});

/**
 * @desc Create Feature
 * @route POST /api/v1/admin/features
 */
exports.createFeature = asyncHandler(async (req, res) => {
  const feature = await Feature.create(req.body);

  return sendSuccess(res, 201, 'Feature created successfully', {
    feature,
  });
});

/**
 * @desc Update Feature
 * @route PUT /api/v1/admin/features/:id
 */
exports.updateFeature = asyncHandler(async (req, res) => {
  const feature = await Feature.findById(req.params.id);

  if (!feature) {
    throw new ApiError(404, 'Feature not found');
  }

  Object.assign(feature, req.body);

  await feature.save();

  return sendSuccess(res, 200, 'Feature updated successfully', {
    feature,
  });
});

/**
 * @desc Delete Feature
 * @route DELETE /api/v1/admin/features/:id
 */
exports.deleteFeature = asyncHandler(async (req, res) => {
  const feature = await Feature.findById(req.params.id);

  if (!feature) {
    throw new ApiError(404, 'Feature not found');
  }

  await feature.deleteOne();

  return sendSuccess(res, 200, 'Feature deleted successfully');
});