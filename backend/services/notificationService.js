const Notification = require('../models/Notification');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Creates a single in-app notification for a user.
 */
const notifyUser = async (userId, { type, title, message, link = null }) => {
  try {
    return await Notification.create({ user: userId, type, title, message, link });
  } catch (error) {
    logger.error(`Failed to create notification for user ${userId}: ${error.message}`);
    return null;
  }
};

/**
 * Broadcasts a notification to all admin users (e.g. new order, low stock,
 * new contact query).
 */
const notifyAdmins = async ({ type, title, message, link = null }) => {
  try {
    const admins = await User.find({ role: 'admin', status: 'active' }).select('_id');
    await Promise.all(admins.map((admin) => notifyUser(admin._id, { type, title, message, link })));
  } catch (error) {
    logger.error(`Failed to broadcast admin notification: ${error.message}`);
  }
};

module.exports = { notifyUser, notifyAdmins };
