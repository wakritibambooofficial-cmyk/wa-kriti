const mongoose = require('mongoose');

const websiteSettingsSchema = new mongoose.Schema(
  {
    singletonKey: { type: String, default: 'main', unique: true },
    websiteName: { type: String, default: 'Wa-Kriti' },
    tagline: { type: String, default: 'Premium Bamboo Living' },
    logo: { url: String, publicId: String },
    favicon: { url: String, publicId: String },

    contactEmail: { type: String, default: 'support@wakriti.com' },
    contactPhone: { type: String, default: '' },
    whatsappNumber: { type: String, default: '' },
    address: { type: String, default: '' },
    googleMapEmbedUrl: { type: String, default: '' },

    socialLinks: {
      instagram: { type: String, default: '' },
      facebook: { type: String, default: '' },
      youtube: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      pinterest: { type: String, default: '' },
    },

    freeShippingThreshold: { type: Number, default: 999 },
    flatShippingCost: { type: Number, default: 79 },
    taxPercentage: { type: Number, default: 0 },

    announcementBar: {
      isEnabled: { type: Boolean, default: true },
      messages: [{ type: String }],
      autoRotateSeconds: { type: Number, default: 5 },
    },

    seo: {
      defaultMetaTitle: { type: String, default: 'Wa-Kriti | Premium Bamboo Living' },
      defaultMetaDescription: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WebsiteSettings', websiteSettingsSchema);
