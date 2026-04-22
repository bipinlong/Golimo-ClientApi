const express = require("express");
const router = express.Router();
const privacypolicyController = require('../controllers/privacypolicyController')
const { resolveTenant } = require('../middleware/tenantMiddleware');

router.get('/get-privacy-policy', resolveTenant, privacypolicyController.getPrivacyPolicy)
// router.get('/generate-return-booking-id', resolveTenant, bookingIdController.generateReturnBookingId)

module.exports = router;