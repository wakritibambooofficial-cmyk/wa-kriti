const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '' },
    description: { type: String, default: '' },
    image: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    ctaPrimaryLabel: { type: String, default: '' },
    ctaPrimaryLink: { type: String, default: '' },
    ctaSecondaryLabel: { type: String, default: '' },
    ctaSecondaryLink: { type: String, default: '' },
    placement: {
      type: String,
      enum: ['hero_slider', 'festival_offer', 'limited_edition', 'announcement_popup', 'category_banner'],
      required: true,
    },
    sortOrder: { type: Number, default: 0 },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: null },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

bannerSchema.index({ placement: 1, status: 1, sortOrder: 1 });

module.exports = mongoose.model('Banner', bannerSchema);
