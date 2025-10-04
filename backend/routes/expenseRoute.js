import express from 'express';
import authMiddleware from '../middleware/auth.js';

import {
    getExpenses,
    createExpense,
    getExpenseById,
    updateExpense,
    deleteExpense,
    getSummary
} from '../controllers/expenseController.js';

const expenseRouter = express.Router();

// Get all expenses and create expense
expenseRouter.route('/gp')
    .get(authMiddleware, getExpenses)
    .post(authMiddleware, createExpense);

// Get summary report
expenseRouter.route('/summary')
    .get(authMiddleware, getSummary);

// Get, update, delete single expense
expenseRouter.route('/:id/gp')
    .get(authMiddleware, getExpenseById)
    .put(authMiddleware, updateExpense)
    .delete(authMiddleware, deleteExpense);

export default expenseRouter;
