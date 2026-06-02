const jwt = require('jsonwebtoken');
const env = require('../config/env');
const AppError = require('../errors/appError');

class JwtHelper {
  static sign(payload) {
    return jwt.sign(payload, env.jwt.secret, {
      expiresIn: env.jwt.expiration,
      algorithm: 'HS256'
    });
  }

  static verify(token) {
    try {
      return jwt.verify(token, env.jwt.secret, { algorithms: ['HS256'] });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new AppError('Token expired', 401);
      }
      throw new AppError('Invalid token', 401);
    }
  }
}

module.exports = JwtHelper;
