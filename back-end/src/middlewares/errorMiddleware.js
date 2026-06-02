const AppError = require('../errors/appError');
const env = require('../config/env');

// eslint-disable-next-line no-unused-vars
const errorMiddleware = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message
    });
  }

  if (env.nodeEnv !== 'production') {
    console.error(error);
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
};

module.exports = errorMiddleware;
