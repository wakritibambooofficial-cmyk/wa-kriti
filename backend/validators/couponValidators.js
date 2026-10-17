const { z } = require('zod');

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID');

const createCouponSchema = z.object({
  code: z.string().trim().min(3, 'Coupon code is required').max(20),
  description: z.string().optional().default(''),
  type: z.enum(['percentage', 'fixed', 'free_shipping']),
  value: z.number().min(0),
  minPurchaseAmount: z.number().min(0).optional().default(0),
  maxDiscountAmount: z.number().min(0).optional().nullable(),
  usageLimit: z.number().int().min(1).optional().nullable(),
  perUserLimit: z.number().int().min(1).optional().default(1),
  applicableCategories: z.array(objectId).optional().default([]),
  applicableProducts: z.array(objectId).optional().default([]),
  membershipOnly: z.boolean().optional().default(false),
  firstOrderOnly: z.boolean().optional().default(false),
  isFestivalCoupon: z.boolean().optional().default(false),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date(),
  status: z.enum(['active', 'inactive']).optional().default('active'),
});

const updateCouponSchema = createCouponSchema.partial();

module.exports = { createCouponSchema, updateCouponSchema };
