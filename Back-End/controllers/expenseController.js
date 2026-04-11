const ExpenseModel = require('../models/expenseModel');
const { sendSuccess, sendError } = require('../utils/responseFormat');

class ExpenseController {
  static async getExpenses(req, res) {
    try {
      const expenses = await ExpenseModel.findByUserId(req.user.id);
      return sendSuccess(res, 200, 'Expenses fetched', expenses);
    } catch (error) {
      console.error("Fetch Error:", error.message);
      return sendError(res, 500, 'Failed to fetch expenses');
    }
  }

  static async addExpense(req, res) {
    try {
      const { amount, currency, category, description, date } = req.body;
      const expense = await ExpenseModel.create(req.user.id, amount, currency, category, description, date);
      return sendSuccess(res, 201, 'Expense added', expense);
    } catch (error) {
      console.error("Add Error:", error.message);
      return sendError(res, 500, 'Failed to add expense');
    }
  }

  static async deleteExpense(req, res) {
    try {
      const { id } = req.params;
      await ExpenseModel.delete(id, req.user.id);
      return sendSuccess(res, 200, 'Expense deleted');
    } catch (error) {
      console.error("Delete Error:", error.message);
      return sendError(res, 500, 'Failed to delete expense');
    }
  }
}

module.exports = ExpenseController;