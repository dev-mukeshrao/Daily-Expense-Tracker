import express from 'express';
import { addExpense, getExpenses, deleteExpense, getExpenseSummary, editExpense } from '../controllers/expenseController.js';

const router = express.Router();

router.post('/', addExpense);
router.get('/', getExpenses);
router.get('/:id', editExpense)
router.delete('/:id', deleteExpense);
router.get('/summary', getExpenseSummary);

export default router;
