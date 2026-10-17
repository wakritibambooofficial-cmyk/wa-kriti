const Product = require('../models/Product');

/**
 * Generates a readable, unique SKU like WAK-FUR-0001 based on a category
 * short-code. Falls back to 'GEN' if no code is supplied.
 * @param {string} categoryCode 3-4 letter code, e.g. 'FUR', 'DEC', 'KIT'
 */
const generateSku = async (categoryCode = 'GEN') => {
  const prefix = `WAK-${categoryCode.toUpperCase().slice(0, 4)}`;
  const count = await Product.countDocuments({ sku: { $regex: `^${prefix}-` } });
  const nextNumber = (count + 1).toString().padStart(4, '0');
  let candidate = `${prefix}-${nextNumber}`;

  // Guard against races / gaps from deleted products
  let suffix = count + 1;
  // eslint-disable-next-line no-await-in-loop
  while (await Product.exists({ sku: candidate })) {
    suffix += 1;
    candidate = `${prefix}-${suffix.toString().padStart(4, '0')}`;
  }
  return candidate;
};

/**
 * Derives a short category code from a category name, e.g.
 * "Furniture" -> "FUR", "Kitchenware" -> "KIT"
 */
const categoryCodeFromName = (name = '') => {
  const cleaned = name.replace(/[^a-zA-Z]/g, '').toUpperCase();
  return cleaned.slice(0, 3) || 'GEN';
};

module.exports = { generateSku, categoryCodeFromName };
