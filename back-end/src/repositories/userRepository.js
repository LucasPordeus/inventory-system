const { query } = require('../config/database');

class UserRepository {
  async create({ name, email, password, salt }) {
    const sql = `
      INSERT INTO users (name, email, password, salt)
      VALUES ($1, $2, $3, $4)
      RETURNING user_id, name, email, created_at
    `;
    const { rows } = await query(sql, [name, email, password, salt]);
    return rows[0];
  }

  async findById(userId) {
    const sql = `
      SELECT user_id, name, email, created_at
      FROM users
      WHERE user_id = $1
    `;
    const { rows } = await query(sql, [userId]);
    return rows[0] || null;
  }

  async findByEmail(email) {
    const sql = `
      SELECT user_id, name, email, password, salt
      FROM users
      WHERE email = $1
    `;
    const { rows } = await query(sql, [email]);
    return rows[0] || null;
  }

  async findAll() {
    const sql = `
      SELECT user_id, name, email, created_at
      FROM users
      ORDER BY user_id ASC
    `;
    const { rows } = await query(sql);
    return rows;
  }

  async update(userId, { name, email }) {
    const sql = `
      UPDATE users
         SET name = COALESCE($2, name),
             email = COALESCE($3, email),
             updated_at = NOW()
       WHERE user_id = $1
       RETURNING user_id, name, email, updated_at
    `;
    const { rows } = await query(sql, [userId, name, email]);
    return rows[0] || null;
  }

  async delete(userId) {
    const sql = `DELETE FROM users WHERE user_id = $1`;
    const result = await query(sql, [userId]);
    return result.rowCount > 0;
  }
}

module.exports = new UserRepository();
