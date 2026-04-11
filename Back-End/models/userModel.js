const db = require('../db');

class UserModel {
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  static async create(userData) {
    const { name, email, password, style, budget, food, travelType, interests, hasPets } = userData;
    const query = `
      INSERT INTO users (name, email, password, style, budget, food, travel_type, interests, has_pets)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, name, email
    `;
    const values = [name, email, password, style, budget, food, travelType, interests, hasPets];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async updateBasicInfo(id, { name, email }) {
    const query = `
      UPDATE users 
      SET name = $1, email = $2 
      WHERE id = $3 
      RETURNING id, name, email, style
    `;
    const result = await db.query(query, [name, email, id]);
    return result.rows[0];
  }

  static async updatePassword(id, hashedPassword) {
    const query = 'UPDATE users SET password = $1 WHERE id = $2';
    await db.query(query, [hashedPassword, id]);
    return true;
  }
}

module.exports = UserModel;