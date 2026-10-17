const express = require('express');
const {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  checkPincode,
} = require('../controllers/addressController');
const { protect } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { addressSchema, updateAddressSchema } = require('../validators/addressValidators');

const router = express.Router();

router.get('/check-pincode/:pincode', checkPincode);

router.use(protect);
router.get('/', getAddresses);
router.post('/', validateRequest(addressSchema), createAddress);
router.put('/:id', validateRequest(updateAddressSchema), updateAddress);
router.delete('/:id', deleteAddress);
router.patch('/:id/default', setDefaultAddress);

module.exports = router;
