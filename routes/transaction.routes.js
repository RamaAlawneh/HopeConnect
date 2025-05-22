const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');

router.get('/', transactionController.getAllTransactions);
router.get('/user/:user_id', transactionController.getByUserId);
router.post('/', transactionController.createTransaction);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
