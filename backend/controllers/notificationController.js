const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * @route GET /api/v1/notifications
 */
const getNotifications = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, parseInt(req.query.limit, 10) || 20);

  const [notifications, unreadCount, total] = await Promise.all([
    Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Notification.countDocuments({ user: req.user._id, read: false }),
    Notification.countDocuments({ user: req.user._id }),
  ]);

  return sendSuccess(res, 200, 'Notifications fetched', { notifications, unreadCount }, { page, limit, total, totalPages: Math.ceil(total / limit) });
});

/**
 * @route PATCH /api/v1/notifications/:id/read
 */
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({ _id: req.params.id, user: req.user._id });
  if (!notification) throw ApiError.notFound('Notification not found');

  notification.read = true;
  await notification.save();

  return sendSuccess(res, 200, 'Notification marked as read', { notification });
});

/**
 * @route PATCH /api/v1/notifications/read-all
 */
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
  return sendSuccess(res, 200, 'All notifications marked as read');
});

/**
 * @route DELETE /api/v1/notifications/:id
 */
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!notification) throw ApiError.notFound('Notification not found');
  return sendSuccess(res, 200, 'Notification deleted');
});

module.exports = { getNotifications, markAsRead, markAllAsRead, deleteNotification };
