
const mongoose = require('mongoose');

const comboOfferSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    promotionType: {
      type: String,
      enum: ['bundle_discount', 'buy_x_get_y'],
      required: true,
    },

    // ---- bundle_discount fields ----
    // Note: `required: true` on the array element does NOT enforce a
    // non-empty array — it only validates elements that exist. The real
    // "must have at least one product for bundle_discount" rule is enforced
    // in the pre('validate') hook below.
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    bundlePrice: { type: Number, default: null, min: 0 },

    // ---- buy_x_get_y fields ----
    eligibleProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
    buyQuantity: { type: Number, default: 2, min: 1 },
    getQuantity: { type: Number, default: 1, min: 1 },
    freeProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null }, // defaults to eligibleProduct if null

    image: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },

    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: null },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

comboOfferSchema.index({ status: 1 });
comboOfferSchema.index({ promotionType: 1 });

// Defense-in-depth: enforce the same type-specific requirements the Zod
// schema enforces, directly at the DB layer. Protects against any future
// route, script, or seed that bypasses the API validation.
comboOfferSchema.pre('validate', function (next) {
  if (this.promotionType === 'bundle_discount') {
    if (!this.products || this.products.length === 0) {
      return next(new Error('products must contain at least one product for bundle_discount offers'));
    }
    if (this.bundlePrice === null || this.bundlePrice === undefined) {
      return next(new Error('bundlePrice is required for bundle_discount offers'));
    }
    // Irrelevant fields shouldn't silently persist on the wrong type
    this.eligibleProduct = null;
    this.freeProduct = null;
  }

  if (this.promotionType === 'buy_x_get_y') {
    if (!this.eligibleProduct) {
      return next(new Error('eligibleProduct is required for buy_x_get_y offers'));
    }
    // Irrelevant fields shouldn't silently persist on the wrong type
    this.products = []; 
    this.bundlePrice = null;
  }

  if (this.endDate && this.startDate && this.endDate < this.startDate) {
    return next(new Error('endDate cannot be before startDate'));
  }

  next();
});

const hamperTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    basketOptions: [
      {
        name: String,
        price: { type: Number, min: 0 },
        image: { url: String, publicId: String },
      },
    ],
    availableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    maxItems: { type: Number, default: 6, min: 1 },
    packagingCost: { type: Number, default: 99, min: 0 },
    greetingCardOptions: [{ type: String }],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

hamperTemplateSchema.index({ status: 1 });

module.exports = {
  ComboOffer: mongoose.model('ComboOffer', comboOfferSchema),
  HamperTemplate: mongoose.model('HamperTemplate', hamperTemplateSchema),
};