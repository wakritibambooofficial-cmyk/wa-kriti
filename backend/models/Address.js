const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    addressLine1: { type: String, required: true, trim: true },
    addressLine2: { type: String, trim: true, default: '' },
    landmark: { type: String, trim: true, default: '' },
    city: { type: String, required: true, trim: true },
    district: { type: String, trim: true, default: '' },
    state: { type: String, required: true, trim: true },
    country: { type: String, required: true, default: 'India' },
    pincode: {
      type: String,
      required: true,
      match: [/^[1-9][0-9]{5}$/, 'Invalid Indian PIN code'],
    },
    label: { type: String, enum: ['home', 'office', 'other'], default: 'home' },
    isDefault: { type: Boolean, default: false },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
  },
  { timestamps: true }
);

addressSchema.index({ user: 1, isDefault: 1 });

module.exports = mongoose.model('Address', addressSchema);
