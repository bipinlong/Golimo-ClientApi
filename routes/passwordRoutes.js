
const express = require("express");
const passwordController = require('../controllers/passwordController')
const { resolveTenant } = require('../middleware/tenantMiddleware');

const router = express.Router();

router.post("/sent-link", resolveTenant, passwordController.forgotPassword);
router.get("/reset-password/:token", resolveTenant, passwordController.verifyResetToken);
router.post("/reset-password", resolveTenant, passwordController.resetPassword)


module.exports = router;