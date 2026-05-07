const db = require('../db');

class JournalModel {
  static async create(userId, title, location, story, rating, date) {
    const query = `
      INSERT INTO journals (user_id, title, location, story, rating, date)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `;
    const values = [userId, title, location, story, rating, date];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query = 'SELECT * FROM journals WHERE user_id = $1 ORDER BY date DESC, created_at DESC';
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async delete(id, userId) {
    const query = 'DELETE FROM journals WHERE id = $1 AND user_id = $2 RETURNING *';
    const result = await db.query(query, [id, userId]);
    return result.rows[0];
  }
}

module.exports = JournalModel;