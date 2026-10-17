const VideoShowcase = require('../models/VideoShowcase');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * @desc Get all active video showcase blocks (Public)
 * @route GET /api/v1/video-showcase
 */
exports.getVideoShowcases = asyncHandler(async (req, res) => {
  const videoShowcases = await VideoShowcase.find({ status: 'active' }).sort({ order: 1 });

  return sendSuccess(res, 200, 'Video showcases fetched successfully', {
    videoShowcases,
  });
}); 

/**
 * @desc Get all video showcase blocks (Admin)
 * @route GET /api/v1/admin/video-showcase
 */
exports.getAllVideoShowcases = asyncHandler(async (req, res) => {
  const videoShowcases = await VideoShowcase.find().sort({ order: 1 });

  return sendSuccess(res, 200, 'Video showcases fetched successfully', {
    videoShowcases,
  });
});

/**
 * @desc Create video showcase block
 * @route POST /api/v1/admin/video-showcase
 */
exports.createVideoShowcase = asyncHandler(async (req, res) => {
  const videoShowcase = await VideoShowcase.create(req.body);

  return sendSuccess(res, 201, 'Video showcase created successfully', {
    videoShowcase,
  });
});

/**
 * @desc Update video showcase block
 * @route PUT /api/v1/admin/video-showcase/:id
 */
exports.updateVideoShowcase = asyncHandler(async (req, res) => {
  const videoShowcase = await VideoShowcase.findById(req.params.id);

  if (!videoShowcase) {
    throw new ApiError(404, 'Video showcase not found');
  }

  Object.assign(videoShowcase, req.body);

  await videoShowcase.save();

  return sendSuccess(res, 200, 'Video showcase updated successfully', {
    videoShowcase,
  });
});

/**
 * @desc Delete video showcase block
 * @route DELETE /api/v1/admin/video-showcase/:id
 */
exports.deleteVideoShowcase = asyncHandler(async (req, res) => {
  const videoShowcase = await VideoShowcase.findById(req.params.id);

  if (!videoShowcase) {
    throw new ApiError(404, 'Video showcase not found');
  }

  await videoShowcase.deleteOne();

  return sendSuccess(res, 200, 'Video showcase deleted successfully');
});