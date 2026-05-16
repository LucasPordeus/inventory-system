const app = require('./app');
const env = require('./config/env');
const { pool } = require('./config/database');

const server = app.listen(env.port, () => {
  console.log(`Server running on port ${env.port} [${env.nodeEnv}]`);
});

const shutdown = async (signal) => {
  console.log(`${signal} received: shutting down gracefully`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});