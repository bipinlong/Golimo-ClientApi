const express = require("express");
const router = express.Router();
const serviceManagementController = require("../controllers/serviceManagementController");
const { resolveTenant } = require("../middleware/tenantMiddleware");

// Apply middleware
router.use(resolveTenant);

// Get service status (Client/Admin)
router.get("/service-status", serviceManagementController.getServiceStatus);

module.exports = router;