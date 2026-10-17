const express = require('express');
const { verifyProductBySerial } = require('../controllers/qrController');

const router = express.Router();

router.get('/:serialNumber', verifyProductBySerial);

module.exports = router;
