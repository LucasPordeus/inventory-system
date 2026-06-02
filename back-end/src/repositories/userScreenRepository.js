const { query, getClient } = require('../config/database');

class UserScreenRepository {
  async assign(userId, screenId) {
    const sql = `
      INSERT INTO users_screens (user_id, screen_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
      RETURNING user_id, screen_id
    `;
    const { rows } = await query(sql, [userId, screenId]);
    return rows[0] || null;
  }

  async revoke(userId, screenId) {
    const sql = `
      DELETE FROM users_screens
       WHERE user_id = $1 AND screen_id = $2
    `;
    const result = await query(sql, [userId, screenId]);
    return result.rowCount > 0;
  }

  async findScreensByUserId(userId) {
    const sql = `
      SELECT s.screen_id, s.name, s.icon, s.redirect
        FROM screens AS s
        INNER JOIN users_screens AS us ON us.screen_id = s.screen_id
       WHERE us.user_id = $1
       ORDER BY s.screen_id ASC
    `;
    const { rows } = await query(sql, [userId]);
    return rows;
  }

  async replaceUserScreens(userId, screenIds) {
    const client = await getClient();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM users_screens WHERE user_id = $1', [userId]);

      if (screenIds.length > 0) {
        const values = screenIds.map((_, index) => `($1, $${index + 2})`).join(', ');
        await client.query(
          `INSERT INTO users_screens (user_id, screen_id) VALUES ${values}`,
          [userId, ...screenIds]
        );
      }
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new UserScreenRepository();
