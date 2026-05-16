const bcrypt = require('bcrypt');
const env = require('../config/env');

class PasswordHelper {
  static async generateSalt() {
    return bcrypt.genSalt(env.security.bcryptSaltRounds);
  }

  static async hash(plainPassword, salt) {
    return bcrypt.hash(plainPassword, salt);
  }

  static async compare(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = PasswordHelper;
