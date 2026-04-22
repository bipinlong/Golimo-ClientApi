const express = require("express");
const router = express.Router();
const userController = require("./../controllers/userController");
const { resolveTenant } = require('../middleware/tenantMiddleware');
// User Registration
router.post("/register", resolveTenant, userController.registerUser);

// User Login
router.post("/login", resolveTenant, userController.loginUser);

router.post('/open-account', resolveTenant, userController.openAccountDetails);

// Get User Details by ID
router.get("/user-details/:id", resolveTenant, userController.getUserDetails);

// Update User Details
router.put("/update-user/:id", resolveTenant, userController.updateUserDetails);

router.get("/get-rides/:account_number", resolveTenant, userController.getRidesByEmail)
router.get("/get-invoices/:account_number", resolveTenant, userController.getInvoicesByAccountNumber)
router.post("/send-invoice-email", resolveTenant, userController.sendInvoiceEmail);
module.exports = router;
