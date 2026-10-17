/**
 * Standardized success response
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {object|array|null} data
 * @param {object|null} pagination
 */
const sendSuccess = (res, statusCode = 200, message = 'Success', data = null, pagination = null) => {
  const payload = { success: true, message, data };
  if (pagination) payload.pagination = pagination;
  return res.status(statusCode).json(payload);
};

/**
 * Standardized error response
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {array} errors
 */
const sendError = (res, statusCode = 500, message = 'Something went wrong', errors = []) => {
  return res.status(statusCode).json({ success: false, message, errors });
};

module.exports = { sendSuccess, sendError };
