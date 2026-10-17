const mongoose = require('mongoose');

const sustainabilityStatSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      enum: ['trees_saved', 'plastic_reduced_kg', 'artisans_supported', 'bamboo_planted', 'carbon_saved_kg', 'orders_delivered'],
    },
    label: { type: String, required: true },
    value: { type: Number, required: true, default: 0 },
    icon: { type: String, default: '' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

const bambooSpeciesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    scientificName: { type: String, default: '' },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, default: '' },
    growthRegion: { type: String, default: '' },
    usedFor: [{ type: String }], // e.g. ['Furniture', 'Kitchenware']
    sustainabilityNotes: { type: String, default: '' },
    image: { url: { type: String, default: null }, publicId: { type: String, default: null } },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

bambooSpeciesSchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

const certificateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ['msme', 'gst', 'trademark', 'fssai', 'quality', 'eco_certification', 'other'],
      required: true,
    },
    file: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    issuedBy: { type: String, default: '' },
    issuedDate: { type: Date, default: null },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = {
  SustainabilityStat: mongoose.model('SustainabilityStat', sustainabilityStatSchema),
  BambooSpecies: mongoose.model('BambooSpecies', bambooSpeciesSchema),
  Certificate: mongoose.model('Certificate', certificateSchema),
};
