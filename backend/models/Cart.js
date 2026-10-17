

// const mongoose = require('mongoose');

// const cartItemSchema = new mongoose.Schema(
//   {
//     product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
//     variantId: { type: mongoose.Schema.Types.ObjectId, default: null },
//     name: { type: String, required: true },
//     image: { type: String, default: null },
//     price: { type: Number, required: true },
//     mrp: { type: Number, default: null },
//     sku: { type: String, default: null },
//     slug: { type: String, default: null },
//     quantity: { type: Number, required: true, min: 1, default: 1 },
//     savedForLater: { type: Boolean, default: false },

//     /*
//      * Promotion linkage.
//      *
//      * When a cart item was added as part of a combo offer / gift hamper,
//      * these fields tie it to every other item that was added alongside it
//      * in the same action, and to the offer document it came from.
//      *
//      * This is what lets us detect (and refuse to allow) a "broken" bundle:
//      * e.g. removing 1 of 4 bundled products, or removing the paid item
//      * from a buy-x-get-y pair while the free item stays behind at ₹0.
//      */
//     comboGroupId: { type: String, default: null, index: true },
//     offerType: {
//       type: String,
//       enum: ['bundle_discount', 'buy_x_get_y', 'hamper', null],
//       default: null,
//     },
//     offerRef: { type: mongoose.Schema.Types.ObjectId, default: null },
//     // 'bundle_member' = one of the N products in a bundle_discount combo
//     // 'eligible'       = the paid product in a buy_x_get_y combo
//     // 'free'           = the free product in a buy_x_get_y combo
//     comboRole: {
//       type: String,
//       enum: ['bundle_member', 'eligible', 'free', null],
//       default: null,
//     },
//     // Belt-and-suspenders flag: any item marked as a free gift must never
//     // be treated as independently purchasable / priced.
//     isFreeItem: { type: Boolean, default: false },
//   },
//   { _id: true }
// );

// const cartSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
//     items: [cartItemSchema],
//     coupon: {
//       code: { type: String, default: null },
//       discountAmount: { type: Number, default: 0 },
//     },
//   },
//   { timestamps: true } 
// );

// cartSchema.virtual('subtotal').get(function () { 
//   return this.items
//     .filter((i) => !i.savedForLater)
//     .reduce((sum, i) => sum + i.price * i.quantity, 0);
// });

// cartSchema.set('toJSON', { virtuals: true });
// cartSchema.set('toObject', { virtuals: true });

// module.exports = mongoose.model('Cart', cartSchema);


const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variantId: { type: mongoose.Schema.Types.ObjectId, default: null },
    name: { type: String, required: true },
    image: { type: String, default: null },
    price: { type: Number, required: true },
    mrp: { type: Number, default: null },
    sku: { type: String, default: null },
    slug: { type: String, default: null },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    savedForLater: { type: Boolean, default: false },

    comboGroupId: { type: String, default: null, index: true },
    offerType: {
      type: String,
      enum: ['bundle_discount', 'buy_x_get_y', 'hamper', null],
      default: null,
    },
    offerRef: { type: mongoose.Schema.Types.ObjectId, default: null },
    comboRole: {
      type: String,
      enum: ['bundle_member', 'eligible', 'free', null],
      default: null,
    },
    isFreeItem: { type: Boolean, default: false },
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    items: [cartItemSchema],
    coupon: {
      code: { type: String, default: null },
      discountAmount: { type: Number, default: 0 },
    },
    // NEW: reward-points redemption. `pointsUsed` is stored so removeRewardPoints
    // / clearCart know exactly how many points to refund the user if the
    // redemption is undone — don't hardcode 50 there, read it back from here.
    reward: {
      applied: { type: Boolean, default: false },
      pointsUsed: { type: Number, default: 0 },
      discountAmount: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

cartSchema.virtual('subtotal').get(function () {
  return this.items
    .filter((i) => !i.savedForLater)
    .reduce((sum, i) => sum + i.price * i.quantity, 0);
});

cartSchema.set('toJSON', { virtuals: true });
cartSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Cart', cartSchema);