const express = require('express');
const { resolveTenant } = require('../middleware/tenantMiddleware');
const paymentController = require('../controllers/paymentController')
const router = express.Router();

router.post('/create-payment', resolveTenant, paymentController.createPaymentIntent)

module.exports = router;
