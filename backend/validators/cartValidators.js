const { z } = require('zod');

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID');

const addCartItemSchema = z.object({
  productId: objectId,
  variantId: objectId.optional().nullable(),
  quantity: z.number().int().min(1).optional().default(1),
});

const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0),
});

const mergeCartSchema = z.object({
  items: z
    .array(
      z.object({
        productId: objectId,
        variantId: objectId.optional().nullable(),
        quantity: z.number().int().min(1).optional().default(1),
      })
    )
    .default([]),
});

const applyCouponSchema = z.object({
  code: z.string().trim().min(3, 'Enter a valid coupon code'),
});

module.exports = { addCartItemSchema, updateCartItemSchema, mergeCartSchema, applyCouponSchema };
