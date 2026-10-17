const express = require('express');
const {
  getMembershipTiers,
  getMyReferralCode,
  applyReferralCode,
} = require('../controllers/membershipController');
const { protect } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { applyReferralSchema } = require('../validators/loyaltyValidators');

const router = express.Router();

router.get('/tiers', getMembershipTiers);

router.use(protect);
router.get('/referrals/my-code', getMyReferralCode);
router.post('/referrals/apply', validateRequest(applyReferralSchema), applyReferralCode);

module.exports = router;
