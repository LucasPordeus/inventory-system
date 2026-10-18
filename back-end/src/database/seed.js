const { query, getClient } = require('../config/database');
const PasswordHelper = require('../utils/passwordHelper');
const env = require('../config/env');

const seed = async () => {
  const { rows } = await query('SELECT user_id FROM users WHERE email = $1', [env.admin.email]);

  if (rows.length > 0) {
    console.log('Seed: admin user already exists, skipping');
    return;
  }

  const salt = await PasswordHelper.generateSalt();
  const hashedPassword = await PasswordHelper.hash(env.admin.password, salt);

  const client = await getClient();
  try {
    await client.query('BEGIN');

    const { rows: [admin] } = await client.query(
      `INSERT INTO users (name, email, password, salt, role)
       VALUES ($1, LOWER(TRIM($2)), $3, $4, 'admin')
       RETURNING user_id`,
      ['Admin', env.admin.email, hashedPassword, salt]
    );

    const { rows: screens } = await client.query('SELECT screen_id FROM screens ORDER BY screen_id ASC');

    if (screens.length > 0) {
      const values = screens.map((_, i) => `($1, $${i + 2})`).join(', ');
      await client.query(
        `INSERT INTO users_screens (user_id, screen_id) VALUES ${values}`,
        [admin.user_id, ...screens.map((s) => s.screen_id)]
      );
    }

    await client.query('COMMIT');
    console.log(`Seed: admin user created — email: ${env.admin.email}`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = seed;
