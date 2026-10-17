const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Category name is required'], trim: true, maxlength: 100 },
    slug: { type: String, unique: true, lowercase: true, index: true },
    description: { type: String, trim: true, default: '' },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null, index: true },

    image: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },
    icon: { type: String, default: null }, // react-icon name or emoji, admin-set
    banner: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },

    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },

    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    metaKeywords: [{ type: String }],

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

categorySchema.index({ status: 1 });
categorySchema.index({ parent: 1, sortOrder: 1 });

categorySchema.pre('validate', async function (next) {
  if (this.name && (this.isModified('name') || !this.slug)) {
    const baseSlug = slugify(this.name, { lower: true, strict: true });
    let candidate = baseSlug;
    let counter = 1;
    const Category = this.constructor;
    // eslint-disable-next-line no-await-in-loop
    while (await Category.exists({ slug: candidate, _id: { $ne: this._id } })) {
      candidate = `${baseSlug}-${counter}`;
      counter += 1;
    }
    this.slug = candidate;
  }
  next();
});

categorySchema.virtual('subCategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
});

categorySchema.set('toJSON', { virtuals: true });
categorySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Category', categorySchema);
