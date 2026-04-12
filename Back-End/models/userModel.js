const db = require('../db');

class UserModel {
  static async findByEmail(email) {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create({ name, email, password, style, budget, food, travelType, interests, hasPets }) {
    // Sesuaikan nama kolom dengan tabel di server.js (travel_type, has_pets)
    const query = `
      INSERT INTO users (name, email, password, style, budget, food, travel_type, interests, has_pets)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, name, email, created_at
    `;
    const values = [
      name, 
      email, 
      password, 
      style || null, 
      budget || null, 
      food || null, 
      travelType || null, 
      interests || null, 
      hasPets || false
    ];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async updatePassword(id, hashedPassword) {
    await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, id]);
  }
}

module.exports = UserModel;