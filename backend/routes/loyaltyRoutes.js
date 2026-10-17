const express = require('express');
const { getWallet, getRewards } = require('../controllers/loyaltyController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/wallet', protect, getWallet);
router.get('/rewards', protect, getRewards);

module.exports = router;
