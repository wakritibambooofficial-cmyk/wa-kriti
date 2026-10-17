const express = require('express');
const { getProductQuestions, askQuestion } = require('../controllers/questionController');
const { protect } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { askQuestionSchema } = require('../validators/engagementValidators');

const router = express.Router();

router.get('/product/:productId', getProductQuestions);
router.post('/product/:productId', protect, validateRequest(askQuestionSchema), askQuestion);

module.exports = router;
