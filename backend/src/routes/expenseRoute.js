import express from 'express';
import { addExpense, getExpenses, deleteExpense, getExpenseSummary, getExpenseById, updateExpense } from '../controllers/expenseController.js';

const router = express.Router();

router.post('/', addExpense);
router.get('/', getExpenses);
router.get('/:id', getExpenseById);
router.put("/:id", updateExpense);
router.delete('/:id', deleteExpense);
router.get('/summary', getExpenseSummary);

export default router;
