const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

const runMigrations = async () => {
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    console.log(`Running migration: ${file}`);
    await pool.query(sql);
  }

  console.log('Migrations executed successfully');
  await pool.end();
};

runMigrations().catch((error) => {
  console.error('Migration error:', error);
  process.exit(1);
});