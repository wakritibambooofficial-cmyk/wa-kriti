const express = require('express');
const { createReturnRequest, getMyReturnRequests } = require('../controllers/returnController');
const { protect } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { createReturnRequestSchema } = require('../validators/engagementValidators');
const { memoryUpload } = require('../config/cloudinary');

const router = express.Router();
const returnImages = memoryUpload.array('images', 5);

router.use(protect);
router.post('/', returnImages, validateRequest(createReturnRequestSchema), createReturnRequest);
router.get('/my', getMyReturnRequests);

module.exports = router;
 