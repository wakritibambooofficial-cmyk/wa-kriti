const mongoose = require('mongoose');

const homepageSectionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      enum: [
        'brand_intro',
        'why_choose_us',
        'sustainability_counters',
        'featured_collections',
        'testimonials',
        'newsletter',
        'instagram_gallery',
      ],
    },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    content: { type: String, default: '' }, // rich text (HTML) for brand_intro etc.
    image: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },
    items: [
      {
        label: String,
        value: String, // e.g. counter value, feature title
        description: String,
        icon: String,
      },
    ],
    isVisible: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HomepageSection', homepageSectionSchema);
