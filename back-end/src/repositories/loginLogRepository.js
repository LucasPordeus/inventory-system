const { query } = require('../config/database');

class LoginLogRepository {
  async insert(userId) {
    const sql = `
      INSERT INTO logs_login (user_id)
      VALUES ($1)
      RETURNING log_id, user_id, date_time_login
    `;
    const { rows } = await query(sql, [userId]);
    return rows[0];
  }
}

module.exports = new LoginLogRepository();
