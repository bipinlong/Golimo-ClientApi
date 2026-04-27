const express = require("express");
const router = express.Router();
const shuttlePricingController = require("../controllers/shuttlePricingController");

const { resolveTenant } = require("../middleware/tenantMiddleware");

// Apply middlewares
router.use( resolveTenant);

// Get shuttle pricing for tenant
router.get("/get-shuttle-pricing", shuttlePricingController.getShuttlePricing);

module.exports = router;