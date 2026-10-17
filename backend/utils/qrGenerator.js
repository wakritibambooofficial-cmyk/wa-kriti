const QRCode = require('qrcode');
const crypto = require('crypto');

/**
 * Generates a unique, unguessable serial number for a product (used for
 * QR-based authenticity verification).
 */
const generateSerialNumber = () => `WAK-AUTH-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;

/**
 * Generates a QR code as a base64 data URL pointing to the product's
 * public authenticity-verification page.
 * @param {string} serialNumber
 * @returns {Promise<string>} data URL (image/png;base64)
 */
const generateProductQrDataUrl = async (serialNumber) => {
  const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify/${serialNumber}`;
  return QRCode.toDataURL(verifyUrl, {
    errorCorrectionLevel: 'M',
    margin: 2,
    color: { dark: '#3F5B3E', light: '#FFFFFF' },
  });
};

module.exports = { generateSerialNumber, generateProductQrDataUrl };
