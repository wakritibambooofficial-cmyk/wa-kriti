const Product = require('../models/Product');
const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');
const { productsToCsv, parseProductsCsv } = require('../utils/csvHelper');
const { generateSku, categoryCodeFromName } = require('../utils/skuGenerator');
const logger = require('../utils/logger');

/**
 * @route GET /api/v1/admin/products-io/export
 * Streams all products as a downloadable CSV file.
 */ 
const exportProductsCsv = asyncHandler(async (req, res) => { 
  const products = await Product.find({ deletedAt: null }).populate('category', 'name').lean();
  const csv = productsToCsv(products);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=wakriti-products-${Date.now()}.csv`);
  res.send(csv);
});

/**
 * @route POST /api/v1/admin/products-io/import
 * Accepts an uploaded CSV ('file' field). Category is matched by name; rows
 * with an unknown category are skipped and reported back to the admin.
 */
const importProductsCsv = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('CSV file is required');

  let rows;
  try {
    rows = parseProductsCsv(req.file.buffer);
  } catch (error) {
    throw ApiError.badRequest(`Could not parse CSV: ${error.message}`);
  }

  const results = { created: 0, updated: 0, skipped: [] };

  for (const row of rows) {
    // eslint-disable-next-line no-await-in-loop
    const category = await Category.findOne({ name: new RegExp(`^${row.category}$`, 'i') });
    if (!category) {
      results.skipped.push({ row: row.name, reason: `Category "${row.category}" not found` });
      continue;
    }

    const payload = {
      name: row.name,
      category: category._id,
      price: Number(row.price) || 0,
      comparePrice: row.comparePrice ? Number(row.comparePrice) : null,
      stockQuantity: Number(row.stockQuantity) || 0,
      status: row.status || 'draft',
      material: row.material || 'Bamboo',
      color: row.color || null,
      shortDescription: row.shortDescription || '',
      isHandmade: row.isHandmade === 'true' || row.isHandmade === true,
      isEcoFriendly: row.isEcoFriendly === 'true' || row.isEcoFriendly === true,
      isMadeInIndia: row.isMadeInIndia === 'true' || row.isMadeInIndia === true,
      isBestSeller: row.isBestSeller === 'true' || row.isBestSeller === true,
      isNewArrival: row.isNewArrival === 'true' || row.isNewArrival === true,
      isTrending: row.isTrending === 'true' || row.isTrending === true,
      updatedBy: req.user._id,
    };

    // eslint-disable-next-line no-await-in-loop
    const existing = row.sku ? await Product.findOne({ sku: row.sku }) : null;

    if (existing) {
      Object.assign(existing, payload);
      // eslint-disable-next-line no-await-in-loop
      await existing.save();
      results.updated += 1;
    } else {
      // eslint-disable-next-line no-await-in-loop
      const sku = row.sku || (await generateSku(categoryCodeFromName(category.name)));
      // eslint-disable-next-line no-await-in-loop
      await Product.create({ ...payload, sku, createdBy: req.user._id });
      results.created += 1;
    }
  }

  logger.info(`Product CSV import by admin ${req.user._id}: ${JSON.stringify(results)}`);
  return sendSuccess(res, 200, 'Import completed', { results });
});

module.exports = { exportProductsCsv, importProductsCsv };
