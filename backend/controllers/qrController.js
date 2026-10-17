const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');
const { generateSerialNumber, generateProductQrDataUrl } = require('../utils/qrGenerator');

/**
 * @route POST /api/v1/admin/products/:id/generate-qr
 * Generates (or regenerates) a unique authenticity serial number + QR code
 * data URL for a product.
 */
const generateProductQr = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw ApiError.notFound('Product not found');

  if (!product.qrSerialNumber) {
    let serial;
    let exists = true;
    while (exists) {
      serial = generateSerialNumber();
      // eslint-disable-next-line no-await-in-loop
      exists = await Product.exists({ qrSerialNumber: serial });
    }
    product.qrSerialNumber = serial;
    await product.save();
  }

  const qrDataUrl = await generateProductQrDataUrl(product.qrSerialNumber);

  return sendSuccess(res, 200, 'QR code generated successfully', {
    serialNumber: product.qrSerialNumber,
    qrDataUrl,
  });
});

/**
 * @route GET /api/v1/verify/:serialNumber
 * Public. Used by the QR code's linked page to confirm authenticity.
 */
const verifyProductBySerial = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ qrSerialNumber: req.params.serialNumber }).populate('artisan', 'name village');
  if (!product) {
    return sendSuccess(res, 200, 'Verification result', { authentic: false });
  }

  return sendSuccess(res, 200, 'Verification result', {
    authentic: true,
    product: {
      name: product.name,
      slug: product.slug,
      material: product.material,
      productOrigin: product.productOrigin,
      artisan: product.artisan,
      images: product.images?.slice(0, 1),
    },
  });
});

module.exports = { generateProductQr, verifyProductBySerial };
