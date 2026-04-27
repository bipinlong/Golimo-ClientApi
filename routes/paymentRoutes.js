const express = require('express');
const { resolveTenant } = require('../middleware/tenantMiddleware');
const paymentController = require('../controllers/paymentController')
const router = express.Router();


router.use(resolveTenant);

router.get('/create-payment', resolveTenant, paymentController.getStripeConfig)

// ✅ Payment Intent create - isme secret_key use hogi
router.post('/create-payment-intent', resolveTenant, paymentController.createPaymentIntent);

module.exports = router;
