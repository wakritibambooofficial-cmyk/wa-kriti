// const express = require('express');
// const {
//   initiateCheckout,
//   verifyPayment,
//   handlePaymentFailure,
//   getMyOrders,
//   getOrderById,
//   downloadInvoice,
//   cancelOrder,
// } = require('../controllers/orderController');
// const { protect } = require('../middlewares/authMiddleware');
// const validateRequest = require('../middlewares/validateRequest');
// const {
//   checkoutSchema,
//   verifyPaymentSchema,
//   paymentFailedSchema,
//   cancelOrderSchema,
// } = require('../validators/orderValidators');
 
// const router = express.Router();

// router.use(protect);

// router.post('/checkout', validateRequest(checkoutSchema), initiateCheckout);
// router.post('/verify-payment', validateRequest(verifyPaymentSchema), verifyPayment);
// router.post('/payment-failed', validateRequest(paymentFailedSchema), handlePaymentFailure);
// router.get('/my', getMyOrders);
// router.get('/:id', getOrderById);
// router.get('/:id/invoice', downloadInvoice);
// router.post('/:id/cancel', validateRequest(cancelOrderSchema), cancelOrder);

// module.exports = router;


const express = require('express');
const {
  initiateCheckout,
  verifyPayment,
  handlePaymentFailure,
  getMyOrders,
  getOrderById,
  downloadInvoice,
  cancelOrder,
  markOrderPaid,
} = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const {
  checkoutSchema,
  verifyPaymentSchema,
  paymentFailedSchema,
  cancelOrderSchema,
} = require('../validators/orderValidators');

const router = express.Router();

router.use(protect);

router.post('/checkout', validateRequest(checkoutSchema), initiateCheckout);
router.post('/verify-payment', validateRequest(verifyPaymentSchema), verifyPayment);
router.post('/payment-failed', validateRequest(paymentFailedSchema), handlePaymentFailure);
router.get('/my', getMyOrders);
router.get('/:id', getOrderById);
router.get('/:id/invoice', downloadInvoice);
router.post('/:id/cancel', validateRequest(cancelOrderSchema), cancelOrder);

// Admin only (role is checked inside the controller): confirm a manual UPI payment
router.patch('/:id/mark-paid', markOrderPaid);

module.exports = router;