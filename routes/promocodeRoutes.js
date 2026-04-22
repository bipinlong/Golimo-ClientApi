const express = require("express");
const promocodeController = require('./../controllers/promocodeController')
const { resolveTenant } = require('../middleware/tenantMiddleware');

const router = express.Router();

router.post("/apply-promocode", resolveTenant, promocodeController.applyPromoCode);



module.exports = router;