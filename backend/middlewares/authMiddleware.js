const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { verifyAccessToken } = require('../utils/tokenUtils');
const User = require('../models/User');

/**
 * Verifies the access token from the Authorization header and attaches
 * the authenticated user to req.user.
 */
const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw ApiError.unauthorized('You must be logged in to access this resource');
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Access token expired', [{ code: 'TOKEN_EXPIRED' }]);
    }
    throw ApiError.unauthorized('Invalid access token');
  }

  const user = await User.findById(decoded.id);
  if (!user) throw ApiError.unauthorized('User no longer exists');
  if (user.status === 'blocked') throw ApiError.forbidden('Your account has been blocked. Contact support.');
  if (user.status === 'deleted') throw ApiError.forbidden('This account is no longer active');

  req.user = user;
  next();
});

/**
 * Restricts route access to specific roles.
 * @param  {...string} roles
 */
const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw ApiError.forbidden('You do not have permission to perform this action');
    }
    next();
  };

/**
 * Like `protect`, but never blocks the request. If a valid access token is
 * present, req.user is populated; otherwise the request proceeds with
 * req.user left undefined. Used for endpoints that behave differently for
 * guests vs logged-in users (e.g. search history, stock alerts).
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return next();

  try {
    const decoded = verifyAccessToken(authHeader.split(' ')[1]);
    const user = await User.findById(decoded.id);
    if (user && user.status === 'active') req.user = user;
  } catch {
    // Invalid/expired token on an optional-auth route — proceed as guest.
  }
  next();
});

module.exports = { protect, restrictTo, optionalAuth };
