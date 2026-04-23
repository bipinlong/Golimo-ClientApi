const express = require('express');
const { resolveTenant } = require('../middleware/tenantMiddleware');
const router = express.Router();
const financialController = require('../controllers/financialController');

router.get('/savedcards/:id',resolveTenant, financialController.getSavedCards)
router.post('/cards/:id/add', resolveTenant, financialController.addCard);
router.delete('/cards/:userId/delete/:cardId', resolveTenant, financialController.deleteCard);
router.put('/cards/:userId/edit/:cardId', resolveTenant, financialController.editCard);

module.exports = router;