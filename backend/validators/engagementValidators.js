const { z } = require('zod');

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID');
const coercedNumber = (schema) =>
  z.preprocess((val) => (val === '' || val === undefined || val === null ? undefined : Number(val)), schema);

const createReviewSchema = z.object({
  rating: coercedNumber(z.number().int().min(1).max(5)),
  title: z.string().trim().max(150).optional().default(''),
  description: z.string().trim().max(2000).optional().default(''),
});

const updateReviewSchema = createReviewSchema.partial();

const moderateReviewSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'hidden']),
});

const replyReviewSchema = z.object({
  message: z.string().trim().min(1, 'Reply message is required'),
});

const askQuestionSchema = z.object({
  question: z.string().trim().min(5, 'Question must be at least 5 characters').max(500),
});

const answerQuestionSchema = z.object({
  answer: z.string().trim().min(1, 'Answer is required').max(1000),
});

const createReturnRequestSchema = z.object({
  orderId: objectId,
  orderItemId: objectId,
  type: z.enum(['return', 'exchange']),
  reason: z.enum(['wrong_product', 'damaged_product', 'defective', 'quality_issue', 'changed_mind', 'other']),
  description: z.string().optional().default(''),
  exchangeVariantId: objectId.optional().nullable(),
});

const updateReturnRequestSchema = z.object({
  status: z.enum(['requested', 'approved', 'rejected', 'completed']),
  adminNotes: z.string().optional().default(''),
  refundType: z.enum(['full', 'partial']).optional().nullable(),
  refundAmount: z.number().min(0).optional(),
});

module.exports = {
  createReviewSchema,
  updateReviewSchema,
  moderateReviewSchema,
  replyReviewSchema,
  askQuestionSchema,
  answerQuestionSchema,
  createReturnRequestSchema,
  updateReturnRequestSchema,
};
