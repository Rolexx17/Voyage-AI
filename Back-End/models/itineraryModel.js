const db = require('../db'); 

class ItineraryModel {
  static async create(userId, planData) {
    const query = `
      INSERT INTO itineraries (user_id, plan_data)
      VALUES ($1, $2) RETURNING *;
    `;
    const values = [userId, JSON.stringify(planData)];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query = 'SELECT * FROM itineraries WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  // TAMBAHKAN FUNGSI DELETE INI
  static async delete(id, userId) {
    const query = 'DELETE FROM itineraries WHERE id = $1 AND user_id = $2 RETURNING *';
    const result = await db.query(query, [id, userId]);
    return result.rows[0];
  }
}

module.exports = ItineraryModel;