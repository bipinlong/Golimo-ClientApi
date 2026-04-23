const express = require('express');
const { resolveTenant } = require('../middleware/tenantMiddleware');
const router = express.Router();
const storedEmailController = require('../controllers/storedemailController')

router.get("/:userId", resolveTenant, storedEmailController.getStoredEmails);

// ADD new stored email
router.post("/:userId", resolveTenant, storedEmailController.addStoredEmail);

// EDIT stored email
router.put("/:userId/:id", resolveTenant, storedEmailController.editStoredEmail);

// DELETE stored email
router.delete("/:userId/:id", resolveTenant, storedEmailController.deleteStoredEmail);

module.exports = router;