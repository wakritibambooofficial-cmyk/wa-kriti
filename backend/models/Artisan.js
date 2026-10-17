const mongoose = require('mongoose');
const slugify = require('slugify');

const artisanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    village: { type: String, default: '' },
    state: { type: String, default: '' },
    experienceYears: { type: Number, default: 0 },
    story: { type: String, default: '' },
    quote: { type: String, default: '' },
    craftSpecialty: { type: String, default: '' },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    photo: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },
    gallery: [
      {
        url: String,
        publicId: String,
      },
    ],
    videoUrl: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

artisanSchema.pre('validate', async function (next) {
  if (this.name && (this.isModified('name') || !this.slug)) {
    const baseSlug = slugify(this.name, { lower: true, strict: true });
    let candidate = baseSlug;
    let counter = 1;
    const Artisan = this.constructor;
    // eslint-disable-next-line no-await-in-loop
    while (await Artisan.exists({ slug: candidate, _id: { $ne: this._id } })) {
      candidate = `${baseSlug}-${counter}`;
      counter += 1;
    }
    this.slug = candidate;
  }
  next();
});

module.exports = mongoose.model('Artisan', artisanSchema);
