const userRepository = require('../repositories/userRepository');
const userScreenRepository = require('../repositories/userScreenRepository');
const PasswordHelper = require('../utils/passwordHelper');
const JwtHelper = require('../utils/jwtHelper');
const AppError = require('../errors/appError');

class AuthService {
  async authenticate({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await PasswordHelper.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = JwtHelper.sign({ userId: user.user_id, email: user.email });
    const screens = await userScreenRepository.findScreensByUserId(user.user_id);

    return {
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email
      },
      screens
    };
  }
}

module.exports = new AuthService();
