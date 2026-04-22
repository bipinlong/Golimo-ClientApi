const express = require("express");
const vehicleController = require('../controllers/vehiclesController')
const { resolveTenant } = require('../middleware/tenantMiddleware');

const router = express.Router();

router.get('/get-vehicle', resolveTenant, vehicleController.getVehicles)


module.exports = router;