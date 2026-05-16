require('dotenv').config();

const requiredVariables = [
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'JWT_SECRET'
];

const missingVariables = requiredVariables.filter((key) => !process.env[key]);
if (missingVariables.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVariables.join(', ')}`);
}

const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,

  database: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRATION || '1h'
  },

  security: {
    bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,
    rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    rateLimitMaxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  }
});

module.exports = env;