const { z } = require('zod');

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID');
const coercedNumber = (schema) =>
  z.preprocess((val) => (val === '' || val === undefined || val === null ? undefined : Number(val)), schema);
const coercedDate = (schema) =>
  z.preprocess((val) => (val === '' || val === undefined ? undefined : val), schema);

/* --------------------------- Engagement --------------------------- */
const trackSearchSchema = z.object({
  keyword: z.string().trim().min(1),
  resultCount: z.number().int().min(0).optional().default(0),
});

const stockAlertSchema = z.object({
  productId: objectId,
  variantId: objectId.optional().nullable(),
  email: z.string().trim().email().optional(),
});

/* --------------------------- Promotions --------------------------- */
const comboOfferSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().optional().default(''),
  promotionType: z.enum(['bundle_discount', 'buy_x_get_y']),
  products: z
    .preprocess((v) => (typeof v === 'string' ? JSON.parse(v) : v), z.array(objectId))
    .optional()
    .default([]),
  bundlePrice: coercedNumber(z.number().min(0)).optional().nullable(),
  eligibleProduct: objectId.optional().nullable(),
  buyQuantity: coercedNumber(z.number().int().min(1)).optional().default(2),
  getQuantity: coercedNumber(z.number().int().min(1)).optional().default(1),
  freeProduct: objectId.optional().nullable(),
  startDate: coercedDate(z.coerce.date()).optional(),
  endDate: coercedDate(z.coerce.date()).optional().nullable(),
  status: z.enum(['active', 'inactive']).optional().default('active'),
});

const updateComboOfferSchema = comboOfferSchema.partial();

const addComboToCartSchema = z.object({}).optional();

const buildHamperSchema = z.object({
  basketIndex: z.number().int().min(0).optional().default(0),
  productIds: z.array(objectId).min(1, 'Select at least one product'),
  greetingCard: z.string().optional().default(''),
});

const hamperTemplateSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  description: z.string().optional().default(''),
  basketOptions: z.array(z.object({ name: z.string(), price: z.number().min(0) })).optional().default([]),
  availableProducts: z.array(objectId).optional().default([]),
  maxItems: z.number().int().min(1).optional().default(6),
  packagingCost: z.number().min(0).optional().default(99),
  greetingCardOptions: z.array(z.string()).optional().default([]),
  status: z.enum(['active', 'inactive']).optional().default('active'),
});

/* --------------------------- Warehouse --------------------------- */
const warehouseSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  code: z.string().trim().min(2, 'Code is required'),
  address: z.string().optional().default(''),
  city: z.string().optional().default(''),
  state: z.string().optional().default(''),
  pincode: z.string().optional().default(''),
  isPrimary: z.boolean().optional().default(false),
  status: z.enum(['active', 'inactive']).optional().default('active'),
});

const adjustInventorySchema = z.object({
  productId: objectId,
  variantId: objectId.optional().nullable(),
  warehouseId: objectId,
  quantityChange: z.number().int().refine((v) => v !== 0, 'Quantity change cannot be zero'),
  changeType: z.enum(['restock', 'sale', 'adjustment', 'transfer', 'return']).optional().default('adjustment'),
  note: z.string().optional().default(''),
});

module.exports = {
  trackSearchSchema,
  stockAlertSchema,
  comboOfferSchema,
  updateComboOfferSchema,
  addComboToCartSchema,
  buildHamperSchema,
  hamperTemplateSchema,
  warehouseSchema,
  adjustInventorySchema,
};
