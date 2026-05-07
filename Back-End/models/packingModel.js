const db = require('../db');

class PackingModel {
  static async create(userId, title, items) {
    const query = `
      INSERT INTO packing_lists (user_id, title, items)
      VALUES ($1, $2, $3) RETURNING *;
    `;
    // items disimpan sebagai JSONB array [{id, name, isPacked, category}]
    const values = [userId, title, JSON.stringify(items)];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query = 'SELECT * FROM packing_lists WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  static async updateItems(id, userId, items) {
    const query = `
      UPDATE packing_lists SET items = $1 
      WHERE id = $2 AND user_id = $3 RETURNING *;
    `;
    const result = await db.query(query, [JSON.stringify(items), id, userId]);
    return result.rows[0];
  }

  static async delete(id, userId) {
    const query = 'DELETE FROM packing_lists WHERE id = $1 AND user_id = $2 RETURNING *';
    const result = await db.query(query, [id, userId]);
    return result.rows[0];
  }
}

module.exports = PackingModel;