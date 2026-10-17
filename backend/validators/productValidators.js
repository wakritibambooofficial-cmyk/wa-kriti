const { z } = require('zod');

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID');

// Multipart/form-data sends everything as strings, so numeric and boolean
// fields must be coerced. These helpers keep working for normal JSON
// requests too since Number(5) === 5 and true stays true.
const coercedNumber = (schema) =>
  z.preprocess((val) => (val === '' || val === undefined || val === null ? undefined : Number(val)), schema);
const coercedBoolean = (schema) =>
  z.preprocess((val) => {
    if (typeof val === 'boolean') return val;
    if (val === 'true') return true;
    if (val === 'false') return false;
    return val;
  }, schema);
const coercedArray = (schema) =>
  z.preprocess((val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string' && val.length) {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : val.split(',').map((s) => s.trim());
      } catch {
        return val.split(',').map((s) => s.trim());
      }
    }
    return val;
  }, schema);
const coercedJson = (schema) =>
  z.preprocess((val) => {
    if (typeof val === 'string' && val.length) {
      try {
        return JSON.parse(val);
      } catch {
        return val;
      }
    }
    return val;
  }, schema);

const dimensionsSchema = coercedJson(
  z
    .object({
      length: coercedNumber(z.number().min(0)).optional().nullable(),
      width: coercedNumber(z.number().min(0)).optional().nullable(),
      height: coercedNumber(z.number().min(0)).optional().nullable(),
    })
    .optional()
);

const createProductSchema = z.object({
  name: z.string().trim().min(2, 'Product name is required').max(200),
  shortDescription: z.string().trim().max(300).optional().default(''),
  longDescription: z.string().optional().default(''),
  category: objectId,
  subCategory: objectId.optional().nullable(),
  price: coercedNumber(z.number({ invalid_type_error: 'Price must be a number' }).min(0)),
  comparePrice: coercedNumber(z.number().min(0)).optional().nullable(),
  taxPercentage: coercedNumber(z.number().min(0).max(100)).optional().default(0),
  stockQuantity: coercedNumber(z.number().int().min(0)).optional().default(0),
  minStockLevel: coercedNumber(z.number().int().min(0)).optional().default(5),
  status: z.enum(['published', 'draft', 'hidden', 'archived']).optional().default('draft'),
  weight: coercedNumber(z.number().min(0)).optional().nullable(),
  dimensions: dimensionsSchema,
  material: z.string().optional(),
  color: z.string().optional().nullable(),
  finish: z.string().optional().nullable(),
  packagingDetails: z.string().optional(),
  warranty: z.string().optional(),
  returnPolicy: z.string().optional(),
  careInstructions: z.string().optional(),
  manufacturingProcess: z.string().optional(),
  estimatedDeliveryDays: coercedNumber(z.number().int().min(0)).optional(),
  shippingCost: coercedNumber(z.number().min(0)).optional(),
  productOrigin: z.string().optional(),
  artisan: objectId.optional().nullable(),
  tags: coercedArray(z.array(z.string())).optional().default([]),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: coercedArray(z.array(z.string())).optional(),
  searchKeywords: coercedArray(z.array(z.string())).optional(),
  isFeatured: coercedBoolean(z.boolean()).optional(),
  isBestSeller: coercedBoolean(z.boolean()).optional(),
  isNewArrival: coercedBoolean(z.boolean()).optional(),
  isTrending: coercedBoolean(z.boolean()).optional(),
  isLimitedEdition: coercedBoolean(z.boolean()).optional(),
  isFestivalProduct: coercedBoolean(z.boolean()).optional(),
  isHandmade: coercedBoolean(z.boolean()).optional(),
  isEcoFriendly: coercedBoolean(z.boolean()).optional(),
  isMadeInIndia: coercedBoolean(z.boolean()).optional(),
  isTribalArtisanProduct: coercedBoolean(z.boolean()).optional(),
});

const updateProductSchema = createProductSchema.partial();

const createVariantSchema = z.object({
  name: z.string().trim().min(1, 'Variant name is required'),
  price: coercedNumber(z.number().min(0)),
  comparePrice: coercedNumber(z.number().min(0)).optional().nullable(),
  stock: coercedNumber(z.number().int().min(0)).default(0),
  weight: coercedNumber(z.number().min(0)).optional().nullable(),
  dimensions: dimensionsSchema,
  status: z.enum(['active', 'inactive']).optional().default('active'),
});

const bulkStockUpdateSchema = z.object({
  updates: z
    .array(
      z.object({
        productId: objectId,
        stockQuantity: z.number().int().min(0),
      })
    )
    .min(1),
});

const bulkPriceUpdateSchema = z.object({
  productIds: z.array(objectId).min(1),
  price: z.number().min(0).optional(),
  percentageChange: z.number().optional(), // e.g. -10 for 10% off, 5 for 5% increase
});

const createCategorySchema = z.object({
  name: z.string().trim().min(2, 'Category name is required').max(100),
  description: z.string().optional().default(''),
  parent: objectId.optional().nullable(),
  icon: z.string().optional().nullable(),
  isFeatured: coercedBoolean(z.boolean()).optional().default(false),
  sortOrder: coercedNumber(z.number().int()).optional().default(0),
  status: z.enum(['active', 'inactive']).optional().default('active'),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: coercedArray(z.array(z.string())).optional(),
});

const updateCategorySchema = createCategorySchema.partial();

module.exports = {
  createProductSchema,
  updateProductSchema,
  createVariantSchema,
  bulkStockUpdateSchema,
  bulkPriceUpdateSchema,
  createCategorySchema,
  updateCategorySchema,
};
