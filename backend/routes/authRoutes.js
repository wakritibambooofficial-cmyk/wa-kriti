const express = require('express');
const {
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
} = require('../controllers/authController');
const validateRequest = require('../middlewares/validateRequest');
const { protect } = require('../middlewares/authMiddleware');
const { authLimiter, otpLimiter } = require('../middlewares/rateLimiter');
const {
  signupSchema,
  verifyOtpSchema,
  resendOtpSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
} = require('../validators/authValidators');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and session management
 */

router.post('/signup', authLimiter, validateRequest(signupSchema), signup);
router.post('/verify-otp', otpLimiter, validateRequest(verifyOtpSchema), verifyOtp);
router.post('/resend-otp', otpLimiter, validateRequest(resendOtpSchema), resendOtp);
router.post('/login', authLimiter, validateRequest(loginSchema), login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

router.post('/forgot-password', authLimiter, validateRequest(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', authLimiter, validateRequest(resetPasswordSchema), resetPassword);

// Protected routes
router.use(protect);
router.get('/me', getMe);
router.patch('/me', validateRequest(updateProfileSchema), updateProfile);
router.post('/logout-all', logoutAll);
router.post('/change-password', validateRequest(changePasswordSchema), changePassword);
router.get('/sessions', getSessions);
router.delete('/sessions/:id', revokeSession);

module.exports = router;
