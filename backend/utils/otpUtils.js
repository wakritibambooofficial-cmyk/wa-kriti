const crypto = require('crypto');

/**
 * Generates a numeric OTP of configured length (default 6 digits).
 */
const generateOtp = () => {
  const length = parseInt(process.env.OTP_LENGTH, 10) || 6;
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return crypto.randomInt(min, max + 1).toString();
};

/**
 * Hashes an OTP so raw OTP is never stored in the database.
 */
const hashOtp = (otp) => crypto.createHash('sha256').update(otp).digest('hex');

module.exports = { generateOtp, hashOtp };
