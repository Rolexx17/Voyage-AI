const db = require('../db'); 

class ItineraryModel {
  static async create(userId, planData) {
    const query = `
      INSERT INTO itineraries (user_id, plan_data)
      VALUES ($1, $2) RETURNING *;
    `;
    // Gunakan JSON.stringify agar aman masuk ke kolom JSONB
    const values = [userId, JSON.stringify(planData)];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query = 'SELECT * FROM itineraries WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await db.query(query, [userId]);
    return result.rows;
  }
}

module.exports = ItineraryModel;