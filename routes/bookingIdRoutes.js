const express = require("express");
const router = express.Router();
const bookingIdController = require('../controllers/bookingIdController')
const { resolveTenant } = require('../middleware/tenantMiddleware');

router.get('/generate-booking-id', resolveTenant, bookingIdController.generateBookingId)
// router.get('/generate-return-booking-id', resolveTenant, bookingIdController.generateReturnBookingId)

module.exports = router;