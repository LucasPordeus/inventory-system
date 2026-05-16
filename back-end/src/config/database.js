const { Pool } = require('pg');
const env = require('./env');

const pool = new Pool({
  host: env.database.host,
  port: env.database.port,
  database: env.database.name,
  user: env.database.user,
  password: env.database.password,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

pool.on('error', (error) => {
  console.error('Unexpected error on idle database client', error);
  process.exit(1);
});

const query = (text, params) => pool.query(text, params);

const getClient = () => pool.connect();

module.exports = { pool, query, getClient };
