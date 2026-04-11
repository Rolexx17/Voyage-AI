const express = require('express');
const ExpenseController = require('../controllers/expenseController');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, ExpenseController.getExpenses);
router.post('/', verifyToken, ExpenseController.addExpense);
router.delete('/:id', verifyToken, ExpenseController.deleteExpense);

module.exports = router;