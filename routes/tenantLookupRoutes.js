const express = require('express');
const router = express.Router();
const { getTenantByDomain } = require('../controllers/tenantLookupController');

// Public - no tenant middleware needed
router.get('/by-domain', getTenantByDomain);
module.exports = router;
