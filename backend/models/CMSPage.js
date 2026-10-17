const mongoose = require('mongoose');

const cmsPageSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      enum: [
        'about-us',
        'founder',
        'privacy-policy',
        'refund-policy',
        'shipping-policy',
        'cancellation-policy',
        'terms-and-conditions',
        'accessibility-statement',
      ],
    },
    title: { type: String, required: true },
    content: { type: String, default: '' }, // rich text HTML
    heroImage: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CMSPage', cmsPageSchema);
