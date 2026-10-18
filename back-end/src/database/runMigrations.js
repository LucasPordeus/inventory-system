const fs = require('fs');
const path = require('path');
const { pool, getClient } = require('../config/database');
const env = require('../config/env');

const runMigrations = async () => {
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    console.log(`Running migration: ${file}`);
    const client = await getClient();
    try {
      await client.query('SELECT set_config($1, $2, false)', ['app.admin_email', env.admin.email]);
      await client.query(sql);
    } finally {
      client.release();
    }
  }

  console.log('Migrations executed successfully');
};

module.exports = runMigrations;

if (require.main === module) {
  runMigrations()
    .then(() => pool.end())
    .catch((error) => {
      console.error('Migration error:', error);
      process.exit(1);
    });
}
