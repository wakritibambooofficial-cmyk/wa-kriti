const express = require('express');
const { submitContactQuery, subscribeNewsletter, unsubscribeNewsletter } = require('../controllers/contactController');
const validateRequest = require('../middlewares/validateRequest');
const { contactFormSchema, newsletterSchema } = require('../validators/cmsValidators');
const { authLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

router.post('/contact', authLimiter, validateRequest(contactFormSchema), submitContactQuery);
router.post('/newsletter/subscribe', validateRequest(newsletterSchema), subscribeNewsletter);
router.post('/newsletter/unsubscribe', validateRequest(newsletterSchema), unsubscribeNewsletter);

module.exports = router;
