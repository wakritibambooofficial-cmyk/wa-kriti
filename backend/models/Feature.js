const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 250,
    },

    icon: {
      type: String,
      default: '',
    },

    order: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

featureSchema.index({ status: 1, order: 1 });

module.exports = mongoose.model('Feature', featureSchema);