const express = require('express');
const {
  getComboOffers,
  addComboToCart,
  getHamperTemplates,
  buildHamper,
} = require('../controllers/promotionController');
const { protect } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { buildHamperSchema } = require('../validators/growthValidators');

const router = express.Router(); 

router.get('/combo-offers', getComboOffers);
router.get('/hamper-templates', getHamperTemplates);

router.use(protect);
router.post('/combo-offers/:id/add-to-cart', addComboToCart);
router.post('/hamper-templates/:id/build', validateRequest(buildHamperSchema), buildHamper);

module.exports = router;
 
