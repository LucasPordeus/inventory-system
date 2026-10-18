const { query } = require('../config/database');

class UserRepository {
  async create({ name, email, password, salt, role = 'user' }) {
    const sql = `
      INSERT INTO users (name, email, password, salt, role)
      VALUES ($1, LOWER(TRIM($2)), $3, $4, $5)
      RETURNING user_id, name, email, role, created_at
    `;
    const { rows } = await query(sql, [name, email, password, salt, role]);
    return rows[0];
  }

  async findById(userId) {
    const sql = `
      SELECT user_id, name, email, role, created_at
      FROM users
      WHERE user_id = $1
    `;
    const { rows } = await query(sql, [userId]);
    return rows[0] || null;
  }

  async findByEmail(email) {
    const sql = `
      SELECT user_id, name, email, password, salt, role
      FROM users
      WHERE email = LOWER(TRIM($1))
    `;
    const { rows } = await query(sql, [email]);
    return rows[0] || null;
  }

  async findAll() {
    const sql = `
      SELECT user_id, name, email, role, created_at
      FROM users
      ORDER BY user_id ASC
    `;
    const { rows } = await query(sql);
    return rows;
  }

  async update(userId, { name, email }) {
    const sql = `
      UPDATE users
         SET name       = COALESCE($2, name),
             email      = COALESCE(LOWER(TRIM($3)), email),
             updated_at = NOW()
       WHERE user_id = $1
       RETURNING user_id, name, email, role, updated_at
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
