const { stringify } = require('csv-stringify/sync');
const { parse } = require('csv-parse/sync');

const PRODUCT_CSV_COLUMNS = [
  'name', 'sku', 'category', 'price', 'comparePrice', 'stockQuantity', 'status',
  'material', 'color', 'shortDescription', 'isHandmade', 'isEcoFriendly', 'isMadeInIndia',
  'isBestSeller', 'isNewArrival', 'isTrending',
];

/**
 * Converts an array of product documents into a CSV string for admin export.
 * @param {Array<object>} products (lean, populated category with .name)
 */
const productsToCsv = (products) => {
  const rows = products.map((p) => ({
    name: p.name,
    sku: p.sku,
    category: p.category?.name || '',
    price: p.price,
    comparePrice: p.comparePrice ?? '',
    stockQuantity: p.stockQuantity,
    status: p.status,
    material: p.material || '',
    color: p.color || '',
    shortDescription: (p.shortDescription || '').replace(/\n/g, ' '),
    isHandmade: p.isHandmade,
    isEcoFriendly: p.isEcoFriendly,
    isMadeInIndia: p.isMadeInIndia,
    isBestSeller: p.isBestSeller,
    isNewArrival: p.isNewArrival,
    isTrending: p.isTrending,
  }));

  return stringify(rows, { header: true, columns: PRODUCT_CSV_COLUMNS });
};

/**
 * Parses an uploaded CSV buffer into an array of plain row objects.
 * Expected columns match PRODUCT_CSV_COLUMNS (category should be the
 * category NAME, resolved to an ObjectId by the caller).
 * @param {Buffer} buffer
 */
const parseProductsCsv = (buffer) => {
  const records = parse(buffer.toString('utf-8'), {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
  return records;
};

module.exports = { productsToCsv, parseProductsCsv, PRODUCT_CSV_COLUMNS };
