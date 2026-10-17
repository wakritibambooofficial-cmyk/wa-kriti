const Video = require('../models/Video');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');
const {
  uploadVideoBufferToCloudinary,
  deleteVideoFromCloudinary,
} = require('../config/cloudinary');

/**
 * @desc Get all active videos (Public)
 * @route GET /api/v1/videos
 */
exports.getVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find({ status: 'active' }).sort({ order: 1 });

  return sendSuccess(res, 200, 'Videos fetched successfully', {
    videos,
  });
});

/**
 * @desc Get all videos (Admin)
 * @route GET /api/v1/admin/videos
 */
exports.getAllVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find().sort({ order: 1 });

  return sendSuccess(res, 200, 'Videos fetched successfully', {
    videos,
  });
});

/**
 * @desc Upload + create a video (Admin)
 * @route POST /api/v1/admin/videos
 */
exports.createVideo = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'A video file is required');
  }

  const uploaded = await uploadVideoBufferToCloudinary(req.file.buffer, 'videos');

  const video = await Video.create({
    title: req.body.title || '',
    videoUrl: uploaded.url,
    publicId: uploaded.publicId,
    thumbnailUrl: uploaded.thumbnailUrl,
    duration: uploaded.duration,
    format: uploaded.format,
    order: Number(req.body.order) || 0,
    status: req.body.status === 'inactive' ? 'inactive' : 'active',
  });

  return sendSuccess(res, 201, 'Video uploaded successfully', {
    video,
  });
});

/**
 * @desc Update a video's details, optionally replacing the file (Admin)
 * @route PUT /api/v1/admin/videos/:id
 */
exports.updateVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);

  if (!video) {
    throw new ApiError(404, 'Video not found');
  }

  if (req.body.title !== undefined) video.title = req.body.title;
  if (req.body.order !== undefined) video.order = Number(req.body.order) || 0;
  if (req.body.status !== undefined) video.status = req.body.status === 'inactive' ? 'inactive' : 'active';

  // Replacing the actual video file is optional on edit
  if (req.file) {
    const oldPublicId = video.publicId;

    const uploaded = await uploadVideoBufferToCloudinary(req.file.buffer, 'videos');

    video.videoUrl = uploaded.url;
    video.publicId = uploaded.publicId;
    video.thumbnailUrl = uploaded.thumbnailUrl;
    video.duration = uploaded.duration;
    video.format = uploaded.format;

    // Best-effort cleanup of the old asset; don't fail the request if this errors
    deleteVideoFromCloudinary(oldPublicId).catch(() => {});
  }

  await video.save();

  return sendSuccess(res, 200, 'Video updated successfully', {
    video,
  });
});

/**
 * @desc Delete a video (Admin)
 * @route DELETE /api/v1/admin/videos/:id
 */
exports.deleteVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);

  if (!video) {
    throw new ApiError(404, 'Video not found');
  }

  await deleteVideoFromCloudinary(video.publicId);
  await video.deleteOne();

  return sendSuccess(res, 200, 'Video deleted successfully');
});