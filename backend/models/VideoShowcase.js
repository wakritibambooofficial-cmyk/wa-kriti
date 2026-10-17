const mongoose = require('mongoose');

const videoShowcaseSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    subheading: {
      type: String,
      trim: true,
      maxlength: 200,
      default: '',
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    video: {
      url: {
        type: String,
        required: true,
        trim: true,
      },
      // 'upload' -> direct mp4/webm link, rendered with a native <video> tag
      // 'youtube' / 'vimeo' -> rendered in an <iframe> embed
      type: {
        type: String,
        enum: ['upload', 'youtube', 'vimeo'],
        default: 'upload',
      },
      thumbnail: {
        type: String, // optional poster image shown before playback
        default: '',
      },
    },

    ctaLabel: {
      type: String,
      trim: true,
      default: '',
    },
    ctaLink: {
      type: String,
      trim: true,
      default: '',
    },

    videoPosition: {
      type: String,
      enum: ['left', 'right'],
      default: 'left',
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

videoShowcaseSchema.index({ status: 1, order: 1 });

module.exports = mongoose.model('VideoShowcase', videoShowcaseSchema);