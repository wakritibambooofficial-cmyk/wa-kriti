// const jwt = require('jsonwebtoken');

// const generateAccessToken = (payload) =>
//   jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
//     expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
//   });

// const generateRefreshToken = (payload) =>
//   jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
//     expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
//   });

// const verifyAccessToken = (token) => jwt.verify(token, process.env.JWT_ACCESS_SECRET);

// const verifyRefreshToken = (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET);

// /**
//  * Sets refresh token as a secure httpOnly cookie.
//  */
// const setRefreshTokenCookie = (res, token) => {
//   const isProd = process.env.NODE_ENV === 'production';
//   res.cookie('refreshToken', token, {
//     httpOnly: true,
//     secure: isProd,
//     sameSite: isProd ? 'strict' : 'lax',
//     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     path: '/api/v1/auth',
//   });
// };

// const clearRefreshTokenCookie = (res) => {
//   res.clearCookie('refreshToken', { path: '/api/v1/auth' });
// };

// module.exports = {
//   generateAccessToken,
//   generateRefreshToken,
//   verifyAccessToken,
//   verifyRefreshToken,
//   setRefreshTokenCookie,
//   clearRefreshTokenCookie,
// };

const jwt = require('jsonwebtoken');

const generateAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
  });

const generateRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
  });

const verifyAccessToken = (token) => jwt.verify(token, process.env.JWT_ACCESS_SECRET);

const verifyRefreshToken = (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET);

/**
 * Cookie options shared by set and clear.
 * In production the frontend (Vercel) and backend (Render) are on different
 * sites, so the cookie must be SameSite=None and Secure to be sent cross-site.
 * clearCookie must use the same options, or the browser will not removit e it.
 */
const getCookieOptions = () => {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true, 
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/api/v1/auth',
  };
};

/**
 * Sets refresh token as a secure httpOnly cookie.
 */
const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    ...getCookieOptions(),
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

const clearRefreshTokenCookie = (res) => {
  res.clearCookie('refreshToken', getCookieOptions());
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
};