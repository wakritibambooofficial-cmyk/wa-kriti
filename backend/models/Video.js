const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: 100,
      default: '',
    },

    videoUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },

    // Cloudinary can derive a poster frame on the fly from the video
    // publicId, but we store it too so the frontend doesn't need to
    // rebuild the transformation URL itself.
    thumbnailUrl: {
      type: String,
      default: '',
    },

    duration: {
      type: Number, // seconds, comes back from Cloudinary on upload
      default: 0,
    },

    format: {
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

videoSchema.index({ status: 1, order: 1 });

module.exports = mongoose.model('Video', videoSchema);