
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Otp = require('../models/Otp');
const RefreshToken = require('../models/RefreshToken');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');
const { generateOtp, hashOtp } = require('../utils/otpUtils');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} = require('../utils/tokenUtils');
const { sendOtpEmail, sendWelcomeEmail, sendPasswordChangedEmail } = require('../services/emailService');
const logger = require('../utils/logger');

const OTP_EXPIRY_MINUTES = () => parseInt(process.env.OTP_EXPIRY_MINUTES, 10) || 10;
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MINUTES = 30;

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const isAdminEmail = (email) => {
  const admins = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.includes(email.toLowerCase());
};

// const buildUserResponse = (user) => ({
//   id: user._id,
//   firstName: user.firstName,
//   lastName: user.lastName,
//   fullName: user.fullName,
//   email: user.email,
//   phone: user.phone,
//   role: user.role,
//   emailVerified: user.emailVerified,
//   avatar: user.avatar,
//   membership: user.membership,
//   rewardPoints: user.rewardPoints,
//   walletBalance: user.walletBalance,
//   preferredTheme: user.preferredTheme,
// });


const buildUserResponse = (user) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  role: user.role,
  status: user.status,
  emailVerified: user.emailVerified,
  avatar: user.avatar,
  membership: user.membership,
  rewardPoints: user.rewardPoints,
  walletBalance: user.walletBalance,
  lifetimeSpend: user.lifetimeSpend,
  referralCode: user.referralCode,
  preferredTheme: user.preferredTheme,
  language: user.language,
  currency: user.currency,
  notificationPreferences: user.notificationPreferences,
  marketingConsent: user.marketingConsent,
  lastLogin: user.lastLogin,
  loginCount: user.loginCount,
  createdAt: user.createdAt,
});


const issueTokensForUser = async (user, req, res) => {
  const payload = { id: user._id, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await RefreshToken.create({
    user: user._id,
    tokenHash: hashToken(refreshToken),
    device: req.headers['x-device-name'] || 'Unknown Device',
    browser: req.headers['user-agent'] || 'Unknown Browser',
    ip: req.ip,
    userAgent: req.headers['user-agent'] || '',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  setRefreshTokenCookie(res, refreshToken);
  return accessToken;
};

/**
 * Creates (or replaces) the active OTP record for an email + purpose.
 * `payload` is only used for signup_verification — it holds the pending
 * account details so the User document can be created once the OTP is
 * verified, instead of before.
 */
const issueOtp = async (email, purpose, payload = undefined) => {
  const otp = generateOtp();
  await Otp.deleteMany({ email, purpose });
  await Otp.create({
    email,
    otpHash: hashOtp(otp),
    purpose,
    expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES() * 60 * 1000),
    ...(payload ? { payload } : {}),
  });
  sendOtpEmail(email, otp, purpose).catch((e) => logger.error(e.message));
};

/**
 * @route POST /api/v1/auth/signup
 * No User document is created here. Signup details are held on the OTP
 * record itself (`payload`) and the User is only created once the OTP is
 * successfully verified in `verifyOtp`. This avoids unverified/abandoned
 * signups ever landing in the User collection.
 */
// const signup = asyncHandler(async (req, res) => {
//   const { firstName, lastName, email, password, phone } = req.body;

//   const existingUser = await User.findOne({ email });
//   if (existingUser && existingUser.emailVerified) {
//     throw ApiError.conflict('An account with this email already exists');
//   }

//   const role = isAdminEmail(email) ? 'admin' : 'customer';

//   await issueOtp(email, 'signup_verification', { firstName, lastName, password, phone, role });

//   return sendSuccess(res, 201, 'OTP sent to your email. Please verify to complete signup.', {
//     email,
//   });
// });



const signup = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser && existingUser.emailVerified) {
    throw ApiError.conflict('An account with this email already exists');
  }

  const role = isAdminEmail(email) ? 'admin' : 'customer';

  // Hash now — this payload sits in the Otp collection until verified,
  // and raw passwords should never touch the database, even transiently.
  const hashedPassword = await bcrypt.hash(password, 12);

  await issueOtp(email, 'signup_verification', { firstName, lastName, password: hashedPassword, phone, role });

  return sendSuccess(res, 201, 'OTP sent to your email. Please verify to complete signup.', {
    email,
  });
});








/**
 * @route POST /api/v1/auth/verify-otp
 */
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp, purpose } = req.body;

  const otpRecord = await Otp.findOne({ email, purpose, consumed: false }).sort({ createdAt: -1 });
  if (!otpRecord) throw ApiError.badRequest('OTP not found or already used. Please request a new one.');

  if (otpRecord.expiresAt < new Date()) {
    throw ApiError.badRequest('OTP has expired. Please request a new one.');
  }
  if (otpRecord.attempts >= otpRecord.maxAttempts) {
    throw ApiError.tooManyRequests('Maximum OTP attempts exceeded. Please request a new one.');
  }

  const isValid = otpRecord.otpHash === hashOtp(otp);
  if (!isValid) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    throw ApiError.badRequest('Invalid OTP');
  }

  otpRecord.consumed = true;
  await otpRecord.save();

  if (purpose === 'signup_verification') {
    const { firstName, lastName, password, phone, role } = otpRecord.payload || {};
    if (!firstName || !password) {
      throw ApiError.badRequest('Signup details expired or missing. Please sign up again.');
    }

    // Guard against a race: someone else verified/registered this email
    // between OTP creation and now.
    const alreadyExists = await User.findOne({ email, emailVerified: true });
    if (alreadyExists) {
      throw ApiError.conflict('An account with this email already exists');
    }





    // const user = await User.create({
    //   firstName,
    //   lastName,
    //   email,
    //   password,
    //   phone,
    //   role,
    //   emailVerified: true,
    // });


    const user = new User({
      firstName,
      lastName,
      email,
      password, // already hashed in signup()
      phone,
      role,
      emailVerified: true,
    });
    user._passwordAlreadyHashed = true;
    await user.save();





    await Otp.deleteOne({ _id: otpRecord._id });

    sendWelcomeEmail(user.email, user.firstName).catch((e) => logger.error(e.message));

    // Required here rather than at top of file to avoid a circular
    // dependency between authController and loyaltyController.
    const { applyRewardTransaction } = require('./loyaltyController');
    const REGISTRATION_BONUS_POINTS = 50;
    applyRewardTransaction(user._id, {
      type: 'earned',
      points: REGISTRATION_BONUS_POINTS,
      reason: 'registration',
      description: 'Welcome bonus for signing up',
    }).catch((e) => logger.error(`Registration reward points failed: ${e.message}`));

    return sendSuccess(res, 200, 'Email verified successfully. You can now log in.');
  }

  // For password_reset / email_change, verification just confirms OTP validity.
  // A short-lived reset token could be issued here; for simplicity the reset
  // endpoint re-validates a fresh OTP consumption in the same request.
  return sendSuccess(res, 200, 'OTP verified successfully.');
});

/**
 * @route POST /api/v1/auth/resend-otp
 */
const resendOtp = asyncHandler(async (req, res) => {
  const { email, purpose } = req.body;

  if (purpose === 'signup_verification') {
    // No User row exists yet for a pending signup — the pending state now
    // lives on the OTP record itself, so check there instead.
    const pending = await Otp.findOne({ email, purpose: 'signup_verification', consumed: false }).sort({
      createdAt: -1,
    });
    if (!pending || !pending.payload) {
      throw ApiError.badRequest('No pending signup found for this email. Please sign up again.');
    }

    await issueOtp(email, purpose, pending.payload);
    return sendSuccess(res, 200, 'OTP has been resent to your email.');
  }

  const user = await User.findOne({ email });
  if (purpose === 'password_reset' && !user) {
    // Do not reveal whether an email exists for password reset
    return sendSuccess(res, 200, 'If an account exists, an OTP has been sent.');
  }

  await issueOtp(email, purpose);
  return sendSuccess(res, 200, 'OTP has been resent to your email.');
});

/**
 * @route POST /api/v1/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) throw ApiError.unauthorized('Invalid email or password');

  if (user.isLocked()) {
    const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / 60000);
    throw ApiError.forbidden(`Account locked due to multiple failed attempts. Try again in ${minutesLeft} minute(s).`);
  }

  if (user.status === 'blocked') throw ApiError.forbidden('Your account has been blocked. Contact support.');
  if (user.status === 'deleted') throw ApiError.forbidden('This account is no longer active');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    user.failedLoginAttempts += 1;
    if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
      user.lockUntil = new Date(Date.now() + LOCK_TIME_MINUTES * 60 * 1000);
      user.failedLoginAttempts = 0;
    }
    await user.save();
    throw ApiError.unauthorized('Invalid email or password');
  }

  if (!user.emailVerified) {
    throw ApiError.forbidden('Please verify your email before logging in');
  }

  user.failedLoginAttempts = 0;
  user.lockUntil = null;
  user.lastLogin = new Date();
  user.loginCount += 1;
  await user.save();

  const accessToken = await issueTokensForUser(user, req, res);

  return sendSuccess(res, 200, 'Login successful', {
    user: buildUserResponse(user),
    accessToken,
    redirectTo: user.role === 'admin' ? '/admin/dashboard' : '/dashboard',
  });
});

/**
 * @route POST /api/v1/auth/refresh-token
 * Reads refresh token from httpOnly cookie, rotates it, and issues a new
 * access token.
 */
const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw ApiError.unauthorized('No refresh token provided');

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    clearRefreshTokenCookie(res);
    throw ApiError.unauthorized('Invalid or expired refresh token. Please log in again.');
  }

  const tokenHash = hashToken(token);
  const storedToken = await RefreshToken.findOne({ user: decoded.id, tokenHash, isRevoked: false });
  if (!storedToken || storedToken.expiresAt < new Date()) {
    clearRefreshTokenCookie(res);
    throw ApiError.unauthorized('Session expired. Please log in again.');
  }

  const user = await User.findById(decoded.id);
  if (!user) throw ApiError.unauthorized('User no longer exists');

  // Rotate refresh token
  storedToken.isRevoked = true;
  storedToken.lastActiveAt = new Date();
  await storedToken.save();

  const accessToken = await issueTokensForUser(user, req, res);

  return sendSuccess(res, 200, 'Token refreshed', { accessToken, user: buildUserResponse(user) });
});

/**
 * @route POST /api/v1/auth/logout
 */
const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    await RefreshToken.updateMany({ tokenHash: hashToken(token) }, { isRevoked: true });
  }
  clearRefreshTokenCookie(res);
  return sendSuccess(res, 200, 'Logged out successfully');
});

/**
 * @route POST /api/v1/auth/logout-all
 * Requires authentication. Revokes every refresh token for the user.
 */
const logoutAll = asyncHandler(async (req, res) => {
  await RefreshToken.updateMany({ user: req.user._id }, { isRevoked: true });
  clearRefreshTokenCookie(res);
  return sendSuccess(res, 200, 'Logged out from all devices');
});

/**
 * @route POST /api/v1/auth/forgot-password
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  // Always respond the same way to avoid user enumeration
  if (user) {
    await issueOtp(email, 'password_reset');
  }

  return sendSuccess(res, 200, 'If an account exists with this email, an OTP has been sent.');
});

/**
 * @route POST /api/v1/auth/reset-password
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const otpRecord = await Otp.findOne({ email, purpose: 'password_reset', consumed: false }).sort({
    createdAt: -1,
  });
  if (!otpRecord) throw ApiError.badRequest('OTP not found or already used. Please request a new one.');
  if (otpRecord.expiresAt < new Date()) throw ApiError.badRequest('OTP has expired. Please request a new one.');
  if (otpRecord.attempts >= otpRecord.maxAttempts) {
    throw ApiError.tooManyRequests('Maximum OTP attempts exceeded. Please request a new one.');
  }

  const isValid = otpRecord.otpHash === hashOtp(otp);
  if (!isValid) {
    otpRecord.attempts += 1;
    await otpRecord.save();
    throw ApiError.badRequest('Invalid OTP');
  }

  otpRecord.consumed = true;
  await otpRecord.save();

  const user = await User.findOne({ email });
  if (!user) throw ApiError.notFound('User not found');

  user.password = newPassword;
  user.failedLoginAttempts = 0;
  user.lockUntil = null;
  await user.save();

  // Revoke all existing sessions for security
  await RefreshToken.updateMany({ user: user._id }, { isRevoked: true });

  sendPasswordChangedEmail(user.email, user.firstName).catch((e) => logger.error(e.message));

  return sendSuccess(res, 200, 'Password reset successfully. Please log in with your new password.');
});

/**
 * @route POST /api/v1/auth/change-password
 * Requires authentication.
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw ApiError.badRequest('Current password is incorrect');

  user.password = newPassword;
  await user.save();

  await RefreshToken.updateMany({ user: user._id }, { isRevoked: true });
  sendPasswordChangedEmail(user.email, user.firstName).catch((e) => logger.error(e.message));

  return sendSuccess(res, 200, 'Password changed successfully. Please log in again.');
});

/**
 * @route GET /api/v1/auth/me
 */
const getMe = asyncHandler(async (req, res) => {
  return sendSuccess(res, 200, 'Current user fetched', { user: buildUserResponse(req.user) });
});


/**
 * @route PATCH /api/v1/auth/me
 * Requires authentication.
 */
const ALLOWED_PROFILE_FIELDS = ['firstName', 'lastName', 'phone', 'preferredTheme', 'language', 'currency', 'marketingConsent'];

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw ApiError.notFound('User not found');

  ALLOWED_PROFILE_FIELDS.forEach((field) => {
    if (req.body[field] !== undefined) user[field] = req.body[field];
  });

  if (req.body.notificationPreferences && typeof req.body.notificationPreferences === 'object') {
    const { email, inApp } = req.body.notificationPreferences;
    if (email !== undefined) user.notificationPreferences.email = email;
    if (inApp !== undefined) user.notificationPreferences.inApp = inApp;
  }

  await user.save();

  return sendSuccess(res, 200, 'Profile updated successfully', { user: buildUserResponse(user) });
});


/**
 * @route GET /api/v1/auth/sessions
 * Lists active sessions/devices for the logged-in user.
 */
const getSessions = asyncHandler(async (req, res) => {
  const sessions = await RefreshToken.find({
    user: req.user._id,
    isRevoked: false,
    expiresAt: { $gt: new Date() },
  })
    .select('device browser ip lastActiveAt createdAt')
    .sort({ lastActiveAt: -1 });

  return sendSuccess(res, 200, 'Sessions fetched', { sessions });
});

/**
 * @route DELETE /api/v1/auth/sessions/:id
 */
const revokeSession = asyncHandler(async (req, res) => {
  const session = await RefreshToken.findOne({ _id: req.params.id, user: req.user._id });
  if (!session) throw ApiError.notFound('Session not found');
  session.isRevoked = true;
  await session.save();
  return sendSuccess(res, 200, 'Session revoked');
});

module.exports = {
  signup,
  verifyOtp,
  resendOtp,
  login,
  refreshToken,
  logout,
  logoutAll,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile,
  getMe,
  getSessions,
  revokeSession,
};