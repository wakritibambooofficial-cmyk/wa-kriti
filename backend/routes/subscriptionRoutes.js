const express = require('express');
const {
  createSubscription,
  getMySubscriptions,
  pauseSubscription,
  cancelSubscription,
} = require('../controllers/subscriptionController');
const { protect } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { createSubscriptionSchema } = require('../validators/loyaltyValidators');

const router = express.Router();
router.use(protect);

router.post('/', validateRequest(createSubscriptionSchema), createSubscription);
router.get('/my', getMySubscriptions);
router.patch('/:id/pause', pauseSubscription);
router.delete('/:id', cancelSubscription);

module.exports = router;
