// const { z } = require('zod');

// const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID');

// const checkoutSchema = z.object({
//   shippingAddressId: objectId,
//   billingAddressId: objectId.optional().nullable(),
//   paymentMethod: z.enum(['razorpay', 'cod']).optional().default('razorpay'),
//   notes: z.string().optional().default(''),
//   giftWrap: z.boolean().optional().default(false),
//   giftMessage: z.string().optional().default(''),
// });

// const verifyPaymentSchema = z.object({
//   razorpay_order_id: z.string().min(1),
//   razorpay_payment_id: z.string().min(1),
//   razorpay_signature: z.string().min(1),
// });

// const paymentFailedSchema = z.object({
//   razorpay_order_id: z.string().min(1),
//   error: z
//     .object({
//       code: z.string().optional(),
//       description: z.string().optional(),
//     })
//     .optional(),
// });

// const cancelOrderSchema = z.object({
//   reason: z.string().optional(),
// });

// const updateOrderStatusSchema = z.object({
//   status: z.enum([
//     'placed',
//     'confirmed',
//     'packed',
//     'shipped',
//     'out_for_delivery',
//     'delivered',
//     'cancelled',
//     'returned',
//     'refunded',
//     'exchange_requested',
//     'exchange_approved',
//     'exchange_completed',
//   ]),
//   description: z.string().optional().default(''),
//   trackingNumber: z.string().optional(),
//   shippingPartner: z.string().optional(),
// });

// const refundSchema = z.object({
//   amount: z.number().min(0).optional(),
//   reason: z.string().optional(),
// });

// module.exports = {
//   checkoutSchema,
//   verifyPaymentSchema,
//   paymentFailedSchema,
//   cancelOrderSchema,
//   updateOrderStatusSchema,
//   refundSchema,
// };


const { z } = require('zod');

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID');

// FIX: orderController.initiateCheckout has a full, working wallet-payment
// code path (balance check, applyWalletTransaction debit, order
// finalization) — but this schema only allowed 'razorpay' and 'cod'.
// Any request with paymentMethod: 'wallet' was being rejected with a 422
// by validateRequest before the controller ever ran, making the wallet
// checkout flow completely unreachable. Added 'wallet' to the enum so it
// matches what the controller actually supports.
const checkoutSchema = z.object({
  shippingAddressId: objectId,
  billingAddressId: objectId.optional().nullable(),
  paymentMethod: z.enum(['razorpay', 'cod', 'wallet']).optional().default('razorpay'),
  notes: z.string().optional().default(''),
  giftWrap: z.boolean().optional().default(false),
  giftMessage: z.string().optional().default(''),
  redeemPoints: z.number().int().min(0).optional().default(0),
});

const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

const paymentFailedSchema = z.object({
  razorpay_order_id: z.string().min(1),
  error: z
    .object({
      code: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
});

const cancelOrderSchema = z.object({
  reason: z.string().optional(),
});

const updateOrderStatusSchema = z.object({
  status: z.enum([
    'placed',
    'confirmed',
    'packed',
    'shipped',
    'out_for_delivery',
    'delivered',
    'cancelled',
    'returned',
    'refunded',
    'exchange_requested',
    'exchange_approved',
    'exchange_completed',
  ]),
  description: z.string().optional().default(''),
  trackingNumber: z.string().optional(),
  shippingPartner: z.string().optional(),
});

const refundSchema = z.object({
  amount: z.number().min(0).optional(),
  reason: z.string().optional(),
});

module.exports = {
  checkoutSchema,
  verifyPaymentSchema,
  paymentFailedSchema,
  cancelOrderSchema,
  updateOrderStatusSchema,
  refundSchema,
};
