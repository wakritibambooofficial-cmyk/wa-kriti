

const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
      match: [
        /^[A-Z0-9_-]+$/,
        'Coupon code can only contain letters, numbers, hyphens and underscores',
      ],
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },

    type: {
      type: String,
      enum: ['percentage', 'fixed', 'free_shipping'],
      required: [true, 'Coupon type is required'],
    },

    value: {
      type: Number,
      required: [true, 'Coupon value is required'],
      min: [0, 'Coupon value cannot be negative'],
      default: 0,
    },

    minPurchaseAmount: {
      type: Number,
      min: [0, 'Minimum purchase amount cannot be negative'],
      default: 0,
    },

    maxDiscountAmount: {
      type: Number,
      min: [0, 'Maximum discount amount cannot be negative'],
      default: null,
    },

    usageLimit: {
      type: Number,
      min: [1, 'Usage limit must be at least 1'],
      default: null,
    },

    usageCount: {
      type: Number,
      min: 0,
      default: 0,
    },

    perUserLimit: {
      type: Number,
      min: [1, 'Per-user limit must be at least 1'],
      default: 1,
    },

    applicableCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],

    applicableProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],

    membershipOnly: {
      type: Boolean,
      default: false,
    },

    firstOrderOnly: {
      type: Boolean,
      default: false,
    },

    isFestivalCoupon: {
      type: Boolean,
      default: false,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
      required: [true, 'Coupon expiry date is required'],
    },

    status: {
      type: String,
      enum: ['active', 'inactive', 'expired'],
      default: 'active',
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

/*
 * Indexes
 */
couponSchema.index({ status: 1, endDate: 1 });
couponSchema.index({ code: 1 }, { unique: true });

/*
 * Validate coupon configuration before saving.
 */
couponSchema.pre('validate', function (next) {
  // Normalize code
  if (this.code) {
    this.code = this.code.trim().toUpperCase();
  }

  // Normalize description
  if (this.description) {
    this.description = this.description.trim();
  }

  // Free shipping does not need a monetary value.
  if (this.type === 'free_shipping') {
    this.value = 0;
    this.maxDiscountAmount = null;
  }

  // Percentage coupon must be between 0 and 100.
  if (this.type === 'percentage') {
    if (this.value < 0 || this.value > 100) {
      return next(
        new Error('Percentage coupon value must be between 0 and 100')
      );
    }
  }

  // Fixed coupon must have a non-negative value.
  if (this.type === 'fixed') {
    if (this.value < 0) {
      return next(new Error('Fixed coupon value cannot be negative'));
    }
  }

  // Maximum discount is meaningful for percentage coupons.
  if (
    this.maxDiscountAmount !== null &&
    this.maxDiscountAmount !== undefined
  ) {
    if (this.maxDiscountAmount <= 0) {
      return next(
        new Error('Maximum discount amount must be greater than 0')
      );
    }

    if (this.type !== 'percentage') {
      this.maxDiscountAmount = null;
    }
  }

  // Dates
  if (this.startDate && this.endDate) {
    if (this.endDate <= this.startDate) {
      return next(new Error('End date must be after start date'));
    }
  }

  // Usage limit
  if (
    this.usageLimit !== null &&
    this.usageLimit !== undefined &&
    this.usageLimit < 1
  ) {
    return next(new Error('Usage limit must be at least 1'));
  }

  // Per-user limit
  if (this.perUserLimit < 1) {
    return next(new Error('Per-user limit must be at least 1'));
  }

  // Usage count should never exceed usage limit.
  if (
    this.usageLimit !== null &&
    this.usageLimit !== undefined &&
    this.usageCount > this.usageLimit
  ) {
    return next(new Error('Usage count cannot exceed usage limit'));
  }

  next();
});

/*
 * Check whether coupon is currently valid.
 */
couponSchema.methods.isCurrentlyValid = function () {
  const now = new Date();

  if (this.status !== 'active') return false;

  if (this.startDate > now) return false;

  if (this.endDate < now) return false;

  if ( 
    this.usageLimit !== null && 
    this.usageLimit !== undefined &&
    this.usageCount >= this.usageLimit
  ) { 
    return false;
  }

  return true;
};

module.exports = mongoose.model('Coupon', couponSchema); 
