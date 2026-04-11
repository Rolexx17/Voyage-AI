const db = require('../db'); // Sesuaikan dengan config db kamu

class ExpenseModel {
  static async create(userId, amount, currency, category, description, date) {
    const query = `
      INSERT INTO expenses (user_id, amount, currency, category, description, date)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `;
    const values = [userId, amount, currency, category, description, date];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query = 'SELECT * FROM expenses WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async delete(id, userId) {
    const query = 'DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *';
    const result = await db.query(query, [id, userId]);
    return result.rows[0];
  }
}

module.exports = ExpenseModel;