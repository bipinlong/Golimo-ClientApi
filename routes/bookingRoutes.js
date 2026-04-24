
const express = require("express");
const bookingController = require('./../controllers/bookingController')
const { resolveTenant } = require('../middleware/tenantMiddleware');

const router = express.Router();

router.post("/add-booking", resolveTenant, bookingController.addBooking);
router.get("/get-guest-booking", resolveTenant, bookingController.getGuestBookings)
router.put("/cancel-booking/:bookingId", resolveTenant, bookingController.cancelBooking)
router.get("/booking-details/:bookingId", resolveTenant, bookingController.getBookingById)
router.put("/update-booking/:bookingId", resolveTenant, bookingController.updateBooking)

// ✅ Shuttle booking routes - YEH CHANGE KARO (resolveTenant add karo)
router.post("/add-shuttle-booking", resolveTenant, bookingController.addShuttleBooking);
// router.get("/get-all-shuttle-bookings", resolveTenant, bookingController.getAllShuttleBookings);
// router.get("/get-shuttle-booking/:id", resolveTenant, bookingController.getShuttleBookingById);
// router.put("/update-shuttle-booking-status", resolveTenant, bookingController.updateShuttleBookingStatus);


module.exports = router;
