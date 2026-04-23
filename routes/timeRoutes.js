const express = require("express");
const timeController = require('../controllers/timeController')
const { resolveTenant } = require('../middleware/tenantMiddleware');

const router = express.Router();

router.get('/get-book-time', resolveTenant, timeController.getBooktime)
router.get('/get-modify-time', resolveTenant, timeController.getModifytime)
router.get('/get-cancel-time', resolveTenant, timeController.getCanceltime)


module.exports = router;