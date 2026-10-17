const mongoose = require('mongoose');
const slugify = require('slugify');

const blogCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
  },
  { timestamps: true }
);

blogCategorySchema.pre('validate', function (next) {
  if (this.name && (this.isModified('name') || !this.slug)) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const blogCommentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, required: true, trim: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, unique: true, lowercase: true },
    excerpt: { type: String, maxlength: 300, default: '' },
    content: { type: String, required: true }, // rich text HTML
    featuredImage: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'BlogCategory', default: null },
    tags: [{ type: String, trim: true, lowercase: true }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['published', 'draft'], default: 'draft' },
    publishedAt: { type: Date, default: null },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    comments: [blogCommentSchema],
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

blogSchema.index({ title: 'text', excerpt: 'text', tags: 'text' });
blogSchema.index({ status: 1, publishedAt: -1 });

blogSchema.pre('validate', async function (next) {
  if (this.title && (this.isModified('title') || !this.slug)) {
    const baseSlug = slugify(this.title, { lower: true, strict: true });
    let candidate = baseSlug;
    let counter = 1;
    const Blog = this.constructor;
    // eslint-disable-next-line no-await-in-loop
    while (await Blog.exists({ slug: candidate, _id: { $ne: this._id } })) {
      candidate = `${baseSlug}-${counter}`;
      counter += 1;
    }
    this.slug = candidate;
  }
  next();
});

module.exports = {
  Blog: mongoose.model('Blog', blogSchema),
  BlogCategory: mongoose.model('BlogCategory', blogCategorySchema),
};
