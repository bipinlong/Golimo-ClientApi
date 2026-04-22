
const express = require("express");
const bookingController = require('./../controllers/bookingController')
const { resolveTenant } = require('../middleware/tenantMiddleware');

const router = express.Router();

router.post("/add-booking", resolveTenant, bookingController.addBooking);
router.get("/get-guest-booking", resolveTenant, bookingController.getGuestBookings)
router.put("/cancel-booking/:bookingId", resolveTenant, bookingController.cancelBooking)
router.get("/booking-details/:bookingId", resolveTenant, bookingController.getBookingById)
router.put("/update-booking/:bookingId", resolveTenant, bookingController.updateBooking)


module.exports = router;
