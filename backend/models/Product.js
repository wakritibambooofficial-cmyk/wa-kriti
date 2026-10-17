// const mongoose = require('mongoose');
// const slugify = require('slugify');

// const productImageSchema = new mongoose.Schema(
//   {
//     url: { type: String, required: true },
//     publicId: { type: String, required: true },
//     altText: { type: String, default: '' },
//     type: { type: String, enum: ['gallery', 'lifestyle', 'primary'], default: 'gallery' },
//     sortOrder: { type: Number, default: 0 },
//   },
//   { _id: true } 
// );   

// const productVariantSchema = new mongoose.Schema( 
//   {
//     name: { type: String, required: true }, // e.g. "Small", "Round", "Teak Finish"
//     sku: { type: String, required: true },
    
//     price: { type: Number, required: true, min: 0 },
//     comparePrice: { type: Number, min: 0, default: null }, 
//     stock: { type: Number, required: true, min: 0, default: 0 },
//     weight: { type: Number, default: null },
//     dimensions: {
//       length: { type: Number, default: null },
//       width: { type: Number, default: null },
//       height: { type: Number, default: null },
//     },
//     images: [productImageSchema],
//     status: { type: String, enum: ['active', 'inactive'], default: 'active' },
//   },
//   { _id: true }
// );

// const productSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: [true, 'Product name is required'], trim: true, maxlength: 200 },
//     slug: { type: String, unique: true, lowercase: true, index: true },
//     shortDescription: { type: String, trim: true, maxlength: 300, default: '' },
//     longDescription: { type: String, default: '' },

//     category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
//     subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },

//    sku: { type: String, default: null },
//     barcode: { type: String, default: null },
//     brand: { type: String, default: 'Wa-Kriti' },

//     price: { type: Number, required: true, min: 0 },
//     comparePrice: { type: Number, min: 0, default: null }, // MRP
//     costPrice: { type: Number, min: 0, default: null, select: false },
//     taxPercentage: { type: Number, default: 0, min: 0, max: 100 },

//     stockQuantity: { type: Number, default: 0, min: 0 },
//     reservedStock: { type: Number, default: 0, min: 0 },
//     minStockLevel: { type: Number, default: 5 },

//     status: { type: String, enum: ['published', 'draft', 'hidden', 'archived'], default: 'draft', index: true },

//     isFeatured: { type: Boolean, default: false },
//     isBestSeller: { type: Boolean, default: false },
//     isNewArrival: { type: Boolean, default: true },
//     isTrending: { type: Boolean, default: false },
//     isLimitedEdition: { type: Boolean, default: false },
//     isFestivalProduct: { type: Boolean, default: false },
//     isHandmade: { type: Boolean, default: true },
//     isEcoFriendly: { type: Boolean, default: true },
//     isMadeInIndia: { type: Boolean, default: true },
//     isTribalArtisanProduct: { type: Boolean, default: false },

//     weight: { type: Number, default: null },
//     dimensions: {
//       length: { type: Number, default: null },
//       width: { type: Number, default: null },
//       height: { type: Number, default: null },
//     },
//     material: { type: String, default: 'Bamboo' },
//     color: { type: String, default: null },
//     finish: { type: String, default: null },
//     packagingDetails: { type: String, default: '' },
//     warranty: { type: String, default: '' },
//     returnPolicy: { type: String, default: '' },
//     careInstructions: { type: String, default: '' },
//     manufacturingProcess: { type: String, default: '' },

//     estimatedDeliveryDays: { type: Number, default: 5 },
//     shippingCost: { type: Number, default: 0 },

//     productOrigin: { type: String, default: '' },
//     artisan: { type: mongoose.Schema.Types.ObjectId, ref: 'Artisan', default: null },
//     sustainabilityScore: { type: Number, min: 0, max: 100, default: null },

//     images: [productImageSchema],
//     variants: [productVariantSchema],
//     hasVariants: { type: Boolean, default: false },

//     tags: [{ type: String, trim: true, lowercase: true }],

//     metaTitle: { type: String, default: '' },
//     metaDescription: { type: String, default: '' },
//     metaKeywords: [{ type: String }],
//     canonicalUrl: { type: String, default: '' },
//     ogImage: { type: String, default: '' },
//     searchKeywords: [{ type: String, trim: true, lowercase: true }],

//     ratingsAverage: { type: Number, default: 0, min: 0, max: 5 },
//     ratingsCount: { type: Number, default: 0 },

//     relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
//     brochureUrl: { type: String, default: null },

//     qrSerialNumber: { type: String, unique: true, sparse: true },
//     certificates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' }],
//     isMultiWarehouseTracked: { type: Boolean, default: false },

//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     deletedAt: { type: Date, default: null },
//   },
//   { timestamps: true }
// );

// productSchema.index({ name: 'text', shortDescription: 'text', tags: 'text', searchKeywords: 'text' });
// productSchema.index({ price: 1 });
// productSchema.index({ isFeatured: 1, isBestSeller: 1, isNewArrival: 1, isTrending: 1 });
// productSchema.index({ createdAt: -1 });
// productSchema.index(
//   { sku: 1 },
//   { unique: true, partialFilterExpression: { sku: { $type: 'string' } } }
// );
// productSchema.index(
//   { 'variants.sku': 1 },
//   { unique: true, partialFilterExpression: { 'variants.sku': { $type: 'string' } } }
// ); 

// productSchema.virtual('availableStock').get(function () {
//   return Math.max(0, this.stockQuantity - this.reservedStock);
// });

// productSchema.virtual('discountPercentage').get(function () {
//   if (!this.comparePrice || this.comparePrice <= this.price) return 0;
//   return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
// });

// productSchema.virtual('availabilityStatus').get(function () {
//   const available = this.stockQuantity - this.reservedStock;
//   if (available <= 0) return 'out_of_stock';
//   if (available <= this.minStockLevel) return 'low_stock';
//   return 'in_stock';
// });

// productSchema.set('toJSON', { virtuals: true });
// productSchema.set('toObject', { virtuals: true });

// productSchema.pre('validate', async function (next) {
//   if (this.name && (this.isModified('name') || !this.slug)) {
//     const baseSlug = slugify(this.name, { lower: true, strict: true });
//     let candidate = baseSlug;
//     let counter = 1;
//     const Product = this.constructor;
//     // eslint-disable-next-line no-await-in-loop
//     while (await Product.exists({ slug: candidate, _id: { $ne: this._id } })) {
//       candidate = `${baseSlug}-${counter}`;
//       counter += 1;
//     }
//     this.slug = candidate;
//   }
//   next();
// });

// module.exports = mongoose.model('Product', productSchema);


const mongoose = require('mongoose');
const slugify = require('slugify');

const productImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    altText: { type: String, default: '' },
    type: { type: String, enum: ['gallery', 'lifestyle', 'primary'], default: 'gallery' },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: true }
);

const productVariantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g. "Small", "Round", "Teak Finish"
    sku: { type: String, required: true },

    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, min: 0, default: null },
    stock: { type: Number, required: true, min: 0, default: 0 },
    weight: { type: Number, default: null },
    dimensions: {
      length: { type: Number, default: null },
      width: { type: Number, default: null },
      height: { type: Number, default: null },
    },
    images: [productImageSchema],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true, maxlength: 200 },
    slug: { type: String, unique: true, lowercase: true, index: true },
    shortDescription: { type: String, trim: true, maxlength: 300, default: '' },
    longDescription: { type: String, default: '' },

    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },

    sku: { type: String, default: null },
    barcode: { type: String, default: null },
    brand: { type: String, default: 'Wa-Kriti' },

    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, min: 0, default: null }, // MRP
    costPrice: { type: Number, min: 0, default: null, select: false },
    taxPercentage: { type: Number, default: 0, min: 0, max: 100 },

    stockQuantity: { type: Number, default: 0, min: 0 },
    reservedStock: { type: Number, default: 0, min: 0 },
    minStockLevel: { type: Number, default: 5 },

    status: { type: String, enum: ['published', 'draft', 'hidden', 'archived'], default: 'draft', index: true },

    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: true },
    isTrending: { type: Boolean, default: false },
    isLimitedEdition: { type: Boolean, default: false },
    isFestivalProduct: { type: Boolean, default: false },
    isHandmade: { type: Boolean, default: true },
    isEcoFriendly: { type: Boolean, default: true },
    isMadeInIndia: { type: Boolean, default: true },
    isTribalArtisanProduct: { type: Boolean, default: false },

    weight: { type: Number, default: null },
    dimensions: {
      length: { type: Number, default: null },
      width: { type: Number, default: null },
      height: { type: Number, default: null },
    },
    material: { type: String, default: 'Bamboo' },
    color: { type: String, default: null },
    finish: { type: String, default: null },
    packagingDetails: { type: String, default: '' },
    warranty: { type: String, default: '' },
    returnPolicy: { type: String, default: '' },
    careInstructions: { type: String, default: '' },
    manufacturingProcess: { type: String, default: '' },

    estimatedDeliveryDays: { type: Number, default: 5 },
    shippingCost: { type: Number, default: 0 },

    productOrigin: { type: String, default: '' },
    artisan: { type: mongoose.Schema.Types.ObjectId, ref: 'Artisan', default: null },
    sustainabilityScore: { type: Number, min: 0, max: 100, default: null },

    images: [productImageSchema],
    variants: [productVariantSchema],
    hasVariants: { type: Boolean, default: false },

    tags: [{ type: String, trim: true, lowercase: true }],

    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    metaKeywords: [{ type: String }],
    canonicalUrl: { type: String, default: '' },
    ogImage: { type: String, default: '' },
    searchKeywords: [{ type: String, trim: true, lowercase: true }],

    ratingsAverage: { type: Number, default: 0, min: 0, max: 5 },
    ratingsCount: { type: Number, default: 0 },

    relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    brochureUrl: { type: String, default: null },

    qrSerialNumber: { type: String, unique: true, sparse: true },
    certificates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Certificate' }],
    isMultiWarehouseTracked: { type: Boolean, default: false },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', shortDescription: 'text', tags: 'text', searchKeywords: 'text' });
productSchema.index({ price: 1 });
productSchema.index({ isFeatured: 1, isBestSeller: 1, isNewArrival: 1, isTrending: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index(
  { sku: 1 },
  { unique: true, partialFilterExpression: { sku: { $type: 'string' } } }
);
productSchema.index(
  { 'variants.sku': 1 },
  { unique: true, partialFilterExpression: { 'variants.sku': { $type: 'string' } } }
);

productSchema.virtual('availableStock').get(function () {
  return Math.max(0, this.stockQuantity - this.reservedStock);
});

productSchema.virtual('discountPercentage').get(function () {
  if (!this.comparePrice || this.comparePrice <= this.price) return 0;
  return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
});

productSchema.virtual('availabilityStatus').get(function () {
  const available = this.stockQuantity - this.reservedStock;
  if (available <= 0) return 'out_of_stock';
  if (available <= this.minStockLevel) return 'low_stock';
  return 'in_stock';
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

productSchema.pre('validate', async function (next) {
  if (this.name && (this.isModified('name') || !this.slug)) {
    const baseSlug = slugify(this.name, { lower: true, strict: true });
    let candidate = baseSlug;
    let counter = 1;
    const Product = this.constructor;
    // eslint-disable-next-line no-await-in-loop
    while (await Product.exists({ slug: candidate, _id: { $ne: this._id } })) {
      candidate = `${baseSlug}-${counter}`;
      counter += 1;
    }
    this.slug = candidate;
  }
  next();
});

/* ============================================================================
 * ATOMIC STOCK RESERVATION / RELEASE
 *
 * These are the ONLY correct way to reserve/release stock in this app.
 * Every controller that touches stockQuantity/reservedStock/variant stock
 * during checkout, cancellation, or payment-failure handling must go
 * through these — never a bare Product.updateOne({ $inc: ... }) with no
 * guard, which is how oversell race conditions happen under concurrent
 * requests.
 *
 * Both methods are single-document MongoDB operations, which are always
 * atomic regardless of whether the deployment is a replica set or a
 * standalone server — no multi-document transaction is required for
 * correctness here, since each item only ever touches one product doc.
 * releaseStock uses a pipeline update (requires MongoDB 4.2+), which is
 * the default on any current MongoDB Atlas cluster or modern self-hosted
 * install.
 * ========================================================================== */

/**
 * Atomically reserves `quantity` units of stock for a product or variant.
 * Returns true if the reservation succeeded, false if there wasn't enough
 * available stock at the moment of the write (i.e. someone else got there
 * first). Never throws for "not enough stock" — that's a normal outcome
 * the caller is expected to check for.
 *
 * @param {string|ObjectId} productId
 * @param {string|ObjectId|null} variantId
 * @param {number} quantity
 * @returns {Promise<boolean>}
 */
productSchema.statics.reserveStock = async function (productId, variantId, quantity) {
  if (quantity <= 0) return true;

  if (variantId) {
    const result = await this.findOneAndUpdate(
      { _id: productId, 'variants._id': variantId, 'variants.stock': { $gte: quantity } },
      { $inc: { 'variants.$.stock': -quantity } },
      { new: true }
    );
    return !!result;
  }

  // $expr lets us compare two fields on the same document (reservedStock +
  // quantity <= stockQuantity) inside the query filter, so the check and
  // the increment happen as a single atomic operation with no window for
  // a concurrent request to slip in between "read" and "write".
  const result = await this.findOneAndUpdate(
    {
      _id: productId,
      $expr: { $lte: [{ $add: ['$reservedStock', quantity] }, '$stockQuantity'] },
    },
    { $inc: { reservedStock: quantity } },
    { new: true }
  );
  return !!result;
};

/**
 * Releases previously reserved stock (order cancelled, payment failed,
 * checkout attempt rolled back). Floors at 0 atomically via an aggregation
 * pipeline update, so this is always safe to call even if invoked more
 * than once for the same order (e.g. a retried webhook) — it can never
 * push reservedStock or a variant's stock negative or over-release.
 *
 * @param {string|ObjectId} productId
 * @param {string|ObjectId|null} variantId
 * @param {number} quantity
 */
productSchema.statics.releaseStock = async function (productId, variantId, quantity) {
  if (quantity <= 0) return;

  if (variantId) {
    await this.updateOne({ _id: productId, 'variants._id': variantId }, [
      {
        $set: {
          variants: {
            $map: {
              input: '$variants',
              as: 'v',
              in: {
                $cond: [
                  { $eq: [{ $toString: '$$v._id' }, String(variantId)] },
                  { $mergeObjects: ['$$v', { stock: { $add: ['$$v.stock', quantity] } }] },
                  '$$v',
                ],
              },
            },
          },
        },
      },
    ]);
    return;
  }

  await this.updateOne({ _id: productId }, [
    { $set: { reservedStock: { $max: [0, { $subtract: ['$reservedStock', quantity] }] } } },
  ]);
};

/**
 * Atomically sets stockQuantity to `newQty`, but only if doing so wouldn't
 * drop it below whatever is currently reserved. Returns the updated
 * document on success, or null if the write was rejected because reserved
 * stock had grown (e.g. a concurrent checkout) past newQty since the
 * caller last read it. Used by the admin bulk-stock-update endpoint to
 * close the read-then-write race that a plain findById + findByIdAndUpdate
 * pair would leave open.
 *
 * @param {string|ObjectId} productId
 * @param {number} newQty
 */
productSchema.statics.setStockQuantitySafe = async function (productId, newQty) {
  return this.findOneAndUpdate(
    { _id: productId, reservedStock: { $lte: newQty } },
    { $set: { stockQuantity: newQty } },
    { new: true, runValidators: true }
  );
};

module.exports = mongoose.model('Product', productSchema);