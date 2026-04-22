const express = require('express');
const { resolveTenant } = require('../middleware/tenantMiddleware');
const router = express.Router();
const accountController = require('../controllers/accountController');


router.get('/profile/:id', resolveTenant, accountController.getUserDetails);
router.put('/profileUpdate/:id', resolveTenant, accountController.updateUserProfile);

// passengers
router.post("/profile/:id/add-passenger", resolveTenant, accountController.addPassenger);

router.get('/profile/:id/passengers', resolveTenant, accountController.getPassengerDetails)

router.put("/update-passenger/:userId/:profileNumber", resolveTenant, accountController.editPassengers);

router.delete("/delete-passenger/:userId/:profileNumber", resolveTenant, accountController.deletePassengerByProfile);

router.get('/profile/:id/contact-information',resolveTenant, accountController.getContactInformation);

router.post('/profile/:id/contact-information',resolveTenant, accountController.addOrUpdateContactInformation);

router.delete('/profile/:id/contact-information/:contactId',resolveTenant, accountController.deleteContactInformation);

router.post("/profile/:userId/passenger/:profileNumber/send-user-email", resolveTenant, accountController.sendUserDetailEmail);

router.put('/profile/:userId/passenger/:profileNumber/status',resolveTenant, accountController.updatePassengerStatus);

module.exports = router;