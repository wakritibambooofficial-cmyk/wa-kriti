const Address = require('../models/Address');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * @route GET /api/v1/addresses
 */
const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
  return sendSuccess(res, 200, 'Addresses fetched', { addresses });
});

/**
 * @route POST /api/v1/addresses
 */
const createAddress = asyncHandler(async (req, res) => {
  const existingCount = await Address.countDocuments({ user: req.user._id });
  const shouldBeDefault = existingCount === 0 || req.body.isDefault === true;

  if (shouldBeDefault) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
  }

  const address = await Address.create({ ...req.body, user: req.user._id, isDefault: shouldBeDefault });
  return sendSuccess(res, 201, 'Address added successfully', { address });
});

/**
 * @route PUT /api/v1/addresses/:id
 */
// const updateAddress = asyncHandler(async (req, res) => {
//   const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
//   if (!address) throw ApiError.notFound('Address not found');

//   if (req.body.isDefault === true) {
//     await Address.updateMany({ user: req.user._id }, { isDefault: false });
//   }

//   Object.assign(address, req.body);
//   await address.save();

//   return sendSuccess(res, 200, 'Address updated successfully', { address });
// });


const ALLOWED_ADDRESS_FIELDS = [
  'fullName',
  'phone',
  'addressLine1',
  'addressLine2',
  'landmark',
  'city',
  'district',
  'state',
  'country',
  'pincode',
  'label',
  'latitude',
  'longitude',
];

const updateAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
  if (!address) throw ApiError.notFound('Address not found');

  if (req.body.isDefault === true) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
  }

  ALLOWED_ADDRESS_FIELDS.forEach((field) => {
    if (req.body[field] !== undefined) address[field] = req.body[field];
  });
  await address.save();

  return sendSuccess(res, 200, 'Address updated successfully', { address });
});

/**
 * @route DELETE /api/v1/addresses/:id
 */
const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
  if (!address) throw ApiError.notFound('Address not found');

  const wasDefault = address.isDefault;
  await address.deleteOne();

  if (wasDefault) {
    const nextAddress = await Address.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    if (nextAddress) {
      nextAddress.isDefault = true;
      await nextAddress.save();
    }
  }

  return sendSuccess(res, 200, 'Address deleted successfully');
});

/**
 * @route PATCH /api/v1/addresses/:id/default
 */
const setDefaultAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
  if (!address) throw ApiError.notFound('Address not found');

  await Address.updateMany({ user: req.user._id }, { isDefault: false });
  address.isDefault = true;
  await address.save();

  return sendSuccess(res, 200, 'Default address updated', { address });
});

/**
 * @route GET /api/v1/addresses/check-pincode/:pincode
 * Basic serviceability check. In a real deployment this would query a
 * ShippingZone/PincodeServiceability collection; for now every valid
 * 6-digit Indian pincode is treated as serviceable with a flat estimate.
 */
const checkPincode = asyncHandler(async (req, res) => {
  const { pincode } = req.params;
  const isValid = /^[1-9][0-9]{5}$/.test(pincode);
  if (!isValid) throw ApiError.badRequest('Invalid PIN code');

  return sendSuccess(res, 200, 'Serviceability checked', {
    pincode,
    deliverable: true,
    estimatedDeliveryDays: 5,
    expressAvailable: ['110', '400', '560', '600', '700'].includes(pincode.slice(0, 3)),
    shippingCost: 0,
  });
});

module.exports = { getAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress, checkPincode };
