import express from 'express';
import {  addExpense, getExpenses, deleteExpense, getExpenseSummary, getExpenseById, updateExpense, handleRecurringExpenses,toggleRecurringExpense } from '../controllers/expenseController.js';

const router = express.Router();

router.post('/', addExpense);
router.get('/', getExpenses);
router.get('/:id', getExpenseById);
router.put("/:id", updateExpense);
router.delete('/:id', deleteExpense);
router.get('/summary', getExpenseSummary);
router.post("/recurring", handleRecurringExpenses);
router.patch("/:expenseId/toggle-recurring", toggleRecurringExpense);



export default router;
