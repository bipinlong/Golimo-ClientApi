const express = require("express");
const serviceController = require('../controllers/serviceController')
const { resolveTenant } = require('../middleware/tenantMiddleware');
const router = express.Router();

router.get('/get-service', serviceController.getServices)


module.exports = router;