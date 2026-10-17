const { z } = require('zod');

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID');

const creditWalletSchema = z.object({
  amount: z.number().positive('Amount must be greater than zero'),
  description: z.string().optional(),
});

const adjustRewardsSchema = z.object({
  points: z.number().int().refine((v) => v !== 0, 'Points cannot be zero'),
  description: z.string().optional(),
});

const updateMembershipTierSchema = z.object({
  minSpend: z.number().min(0).optional(),
  discountPercentage: z.number().min(0).max(100).optional(),
  freeShipping: z.boolean().optional(),
  earlyAccess: z.boolean().optional(),
  rewardPointsMultiplier: z.number().min(0).optional(),
  perks: z.array(z.string()).optional(),
});

const applyReferralSchema = z.object({
  code: z.string().trim().min(3, 'Enter a valid referral code'),
});

const createSubscriptionSchema = z.object({
  productId: objectId,
  variantId: objectId.optional().nullable(),
  frequency: z.enum(['monthly', 'quarterly', 'yearly']),
  quantity: z.number().int().min(1).optional().default(1),
  addressId: objectId,
});

module.exports = {
  creditWalletSchema,
  adjustRewardsSchema,
  updateMembershipTierSchema,
  applyReferralSchema,
  createSubscriptionSchema,
};
