const express = require('express');
const { resolveTenant } = require('../middleware/tenantMiddleware');
const router = express.Router();
const addressController = require('../controllers/addressController');

router.get('/savedaddresses/:id', resolveTenant, addressController.getSavedAddresses);
router.post('/savedaddresses/:userId/add', resolveTenant, addressController.addAddress);
router.put('/savedaddresses/:userId/edit/:id', resolveTenant, addressController.editAddress);
router.delete('/savedaddresses/:userId/delete/:id', resolveTenant, addressController.deleteAddress);


module.exports = router;