

const mongoose = require('mongoose');

const Coupon = require('../models/Coupon');
const CouponUsage = require('../models/CouponUsage');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');

/*
 * Normalize coupon code.
 */
const normalizeCode = (code) => {
  if (typeof code !== 'string') return '';

  return code.trim().toUpperCase();
};

/*
 * Convert optional number fields safely.
 */
const parseOptionalNumber = (value, fieldName) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw ApiError.badRequest(`${fieldName} must be a valid number`);
  }

  return number;
};

/*
 * Validate ObjectId array.
 */
const validateObjectIdArray = (value, fieldName) => {
  if (value === undefined || value === null) {
    return [];
  }

  if (!Array.isArray(value)) {
    throw ApiError.badRequest(`${fieldName} must be an array`);
  }

  for (const id of value) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw ApiError.badRequest(`Invalid ID in ${fieldName}`);
    }
  }

  return [...new Set(value.map(String))];
};

/*
 * Validate and normalize coupon payload.
 */
const validateCouponPayload = (body, { isUpdate = false } = {}) => {
  const data = { ...body };

  /*
   * CODE
   */
  if (data.code !== undefined) {
    data.code = normalizeCode(data.code);

    if (!data.code) {
      throw ApiError.badRequest('Coupon code is required');
    }

    if (!/^[A-Z0-9_-]+$/.test(data.code)) {
      throw ApiError.badRequest(
        'Coupon code can only contain letters, numbers, hyphens and underscores'
      );
    }

    if (data.code.length < 3 || data.code.length > 50) {
      throw ApiError.badRequest(
        'Coupon code must be between 3 and 50 characters'
      );
    }
  } else if (!isUpdate) {
    throw ApiError.badRequest('Coupon code is required');
  }

  /*
   * TYPE
   */
  const allowedTypes = ['percentage', 'fixed', 'free_shipping'];

  if (data.type !== undefined) {
    if (!allowedTypes.includes(data.type)) {
      throw ApiError.badRequest(
        'Coupon type must be percentage, fixed or free_shipping'
      );
    }
  } else if (!isUpdate) {
    throw ApiError.badRequest('Coupon type is required');
  }

  /*
   * VALUE
   */
  if (data.type === 'free_shipping') {
    data.value = 0;
    data.maxDiscountAmount = null;
  } else if (data.value !== undefined) {
    const value = Number(data.value);

    if (!Number.isFinite(value)) {
      throw ApiError.badRequest('Coupon value must be a valid number');
    }

    if (value < 0) {
      throw ApiError.badRequest('Coupon value cannot be negative');
    }

    data.value = value;
  } else if (!isUpdate) {
    throw ApiError.badRequest('Coupon value is required');
  }

  /*
   * PERCENTAGE
   */
  if (data.type === 'percentage' && data.value !== undefined) {
    if (data.value > 100) {
      throw ApiError.badRequest(
        'Percentage coupon value cannot exceed 100%'
      );
    }
  }

  /*
   * MIN PURCHASE
   */
  if (data.minPurchaseAmount !== undefined) {
    const value = Number(data.minPurchaseAmount);

    if (!Number.isFinite(value) || value < 0) {
      throw ApiError.badRequest(
        'Minimum purchase amount must be 0 or greater'
      );
    }

    data.minPurchaseAmount = value;
  }

  /*
   * MAX DISCOUNT
   */
  if (
    data.maxDiscountAmount !== undefined &&
    data.maxDiscountAmount !== null &&
    data.maxDiscountAmount !== ''
  ) {
    const value = Number(data.maxDiscountAmount);

    if (!Number.isFinite(value) || value <= 0) {
      throw ApiError.badRequest(
        'Maximum discount amount must be greater than 0'
      );
    }

    if (data.type !== 'percentage') {
      throw ApiError.badRequest(
        'Maximum discount amount can only be used with percentage coupons'
      );
    }

    data.maxDiscountAmount = value;
  } else if (data.type === 'free_shipping') {
    data.maxDiscountAmount = null;
  }

  /*
   * USAGE LIMIT
   */
  if (
    data.usageLimit !== undefined &&
    data.usageLimit !== null &&
    data.usageLimit !== ''
  ) {
    const value = Number(data.usageLimit);

    if (!Number.isInteger(value) || value < 1) {
      throw ApiError.badRequest(
        'Usage limit must be a whole number greater than 0'
      );
    }

    data.usageLimit = value;
  } else if (data.usageLimit === '') {
    data.usageLimit = null;
  }

  /*
   * PER USER LIMIT
   */
  if (data.perUserLimit !== undefined) {
    const value = Number(data.perUserLimit);

    if (!Number.isInteger(value) || value < 1) {
      throw ApiError.badRequest(
        'Per-user limit must be a whole number greater than 0'
      );
    }

    data.perUserLimit = value;
  }

  /*
   * USAGE COUNT
   *
   * Do not allow admin/frontend to arbitrarily modify usageCount
   * during normal create/update requests.
   */
  delete data.usageCount;

  /*
   * CATEGORIES
   */
  if (data.applicableCategories !== undefined) {
    data.applicableCategories = validateObjectIdArray(
      data.applicableCategories,
      'applicableCategories'
    );
  }

  /*
   * PRODUCTS
   */
  if (data.applicableProducts !== undefined) {
    data.applicableProducts = validateObjectIdArray(
      data.applicableProducts,
      'applicableProducts'
    );
  }

  /*
   * BOOLEAN FIELDS
   */
  const booleanFields = [
    'membershipOnly',
    'firstOrderOnly',
    'isFestivalCoupon',
  ];

  for (const field of booleanFields) {
    if (data[field] !== undefined) {
      if (typeof data[field] !== 'boolean') {
        throw ApiError.badRequest(`${field} must be true or false`);
      }
    }
  }

  /*
   * START DATE
   */
  if (data.startDate !== undefined) {
    const startDate = new Date(data.startDate);

    if (Number.isNaN(startDate.getTime())) {
      throw ApiError.badRequest('Invalid start date');
    }

    data.startDate = startDate;
  }

  /*
   * END DATE
   */
  if (data.endDate !== undefined) {
    const endDate = new Date(data.endDate);

    if (Number.isNaN(endDate.getTime())) {
      throw ApiError.badRequest('Invalid expiry date');
    }

    data.endDate = endDate;
  } else if (!isUpdate) {
    throw ApiError.badRequest('Expiry date is required');
  }

  /*
   * DATE RELATIONSHIP
   */
  if (data.startDate && data.endDate) {
    if (data.endDate <= data.startDate) {
      throw ApiError.badRequest(
        'Expiry date must be after the start date'
      );
    }
  }

  /*
   * STATUS
   */
  if (data.status !== undefined) {
    const allowedStatuses = ['active', 'inactive', 'expired'];

    if (!allowedStatuses.includes(data.status)) {
      throw ApiError.badRequest(
        'Status must be active, inactive or expired'
      );
    }
  }

  /*
   * Remove fields that should never come directly from client.
   */
  delete data.createdBy;

  return data;
};

/**
 * @route POST /api/v1/admin/coupons
 */
const createCoupon = asyncHandler(async (req, res) => {
  const data = validateCouponPayload(req.body);

  /*
   * Prevent duplicate coupon codes.
   */
  const existing = await Coupon.findOne({
    code: data.code,
  }).lean();

  if (existing) {
    throw ApiError.conflict(
      'A coupon with this code already exists'
    );
  }

  const coupon = await Coupon.create({
    ...data,
    createdBy: req.user._id,
  });

  return sendSuccess(res, 201, 'Coupon created successfully', {
    coupon,
  });
});

/**
 * @route GET /api/v1/admin/coupons
 */
const getCoupons = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const filter = {};

  if (status) {
    if (!['active', 'inactive', 'expired'].includes(status)) {
      throw ApiError.badRequest('Invalid coupon status');
    }

    filter.status = status;
  }

  const coupons = await Coupon.find(filter)
    .populate('applicableCategories', 'name')
    .populate('applicableProducts', 'name sku')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  return sendSuccess(res, 200, 'Coupons fetched', {
    coupons,
  });
});

/**
 * @route GET /api/v1/admin/coupons/:id
 */
const getCouponById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw ApiError.badRequest('Invalid coupon ID');
  }

  const coupon = await Coupon.findById(req.params.id)
    .populate('applicableCategories', 'name')
    .populate('applicableProducts', 'name sku')
    .populate('createdBy', 'name email');

  if (!coupon) {
    throw ApiError.notFound('Coupon not found');
  }

  const usageCount = await CouponUsage.countDocuments({
    coupon: coupon._id,
  });

  const totalDiscountGiven = await CouponUsage.aggregate([
    {
      $match: {
        coupon: coupon._id,
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: '$discountAmount',
        },
      },
    },
  ]);

  return sendSuccess(res, 200, 'Coupon fetched', {
    coupon,
    analytics: {
      usageCount,
      totalDiscountGiven:
        totalDiscountGiven[0]?.total || 0,
    },
  });
});

/**
 * @route PUT /api/v1/admin/coupons/:id
 */
const updateCoupon = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw ApiError.badRequest('Invalid coupon ID');
  }

  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    throw ApiError.notFound('Coupon not found');
  }

  const data = validateCouponPayload(req.body, {
    isUpdate: true,
  });

  /*
   * If code is being changed, make sure it is unique.
   */
  if (data.code && data.code !== coupon.code) {
    const duplicate = await Coupon.findOne({
      code: data.code,
      _id: { $ne: coupon._id },
    }).lean();

    if (duplicate) {
      throw ApiError.conflict(
        'A coupon with this code already exists'
      );
    }
  }

  Object.assign(coupon, data);

  await coupon.save();

  return sendSuccess(res, 200, 'Coupon updated successfully', {
    coupon,
  });
});

/**
 * @route PATCH /api/v1/admin/coupons/:id/toggle
 */
const toggleCouponStatus = asyncHandler(async (req, res) => { 
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw ApiError.badRequest('Invalid coupon ID');
  }

  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    throw ApiError.notFound('Coupon not found');
  }

  /*
   * Do not reactivate an already expired coupon.
   */
  if (
    coupon.endDate &&
    coupon.endDate <= new Date()
  ) {
    coupon.status = 'expired';
    await coupon.save();

    throw ApiError.badRequest(
      'This coupon has expired and cannot be activated'
    );
  }

  coupon.status =
    coupon.status === 'active'
      ? 'inactive'
      : 'active';

  await coupon.save();

  return sendSuccess(
    res,
    200,
    `Coupon ${
      coupon.status === 'active'
        ? 'activated'
        : 'deactivated'
    }`,
    {
      coupon,
    }
  );
});

/**
 * @route DELETE /api/v1/admin/coupons/:id
 */
const deleteCoupon = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw ApiError.badRequest('Invalid coupon ID');
  }

  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    throw ApiError.notFound('Coupon not found');
  }

  await coupon.deleteOne();

  return sendSuccess(
    res,
    200, 
    'Coupon deleted successfully'
  );
});

module.exports = {
  createCoupon,
  getCoupons, 
  getCouponById,
  updateCoupon, 
  toggleCouponStatus,
  deleteCoupon,
};