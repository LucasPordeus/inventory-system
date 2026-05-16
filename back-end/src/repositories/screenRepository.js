const { query } = require('../config/database');

class ScreenRepository {
  async create({ name, icon, redirect }) {
    const sql = `
      INSERT INTO screens (name, icon, redirect)
      VALUES ($1, $2, $3)
      RETURNING screen_id, name, icon, redirect
    `;
    const { rows } = await query(sql, [name, icon, redirect]);
    return rows[0];
  }

  async findById(screenId) {
    const sql = `
      SELECT screen_id, name, icon, redirect
      FROM screens
      WHERE screen_id = $1
    `;
    const { rows } = await query(sql, [screenId]);
    return rows[0] || null;
  }

  async findByName(name) {
    const sql = `
      SELECT screen_id, name, icon, redirect
      FROM screens
      WHERE name = $1
    `;
    const { rows } = await query(sql, [name]);
    return rows[0] || null;
  }

  async findAll() {
    const sql = `
      SELECT screen_id, name, icon, redirect
      FROM screens
      ORDER BY screen_id ASC
    `;
    const { rows } = await query(sql);
    return rows;
  }

  async update(screenId, { name, icon, redirect }) {
    const sql = `
      UPDATE screens
         SET name = COALESCE($2, name),
             icon = COALESCE($3, icon),
             redirect = COALESCE($4, redirect),
             updated_at = NOW()
       WHERE screen_id = $1
       RETURNING screen_id, name, icon, redirect
    `;
    const { rows } = await query(sql, [screenId, name, icon, redirect]);
    return rows[0] || null;
  }

  async delete(screenId) {
    const sql = `DELETE FROM screens WHERE screen_id = $1`;
    const result = await query(sql, [screenId]);
    return result.rowCount > 0;
  }
}

module.exports = new ScreenRepository();
