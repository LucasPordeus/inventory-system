const userRepository = require('../repositories/userRepository');
const userScreenRepository = require('../repositories/userScreenRepository');
const PasswordHelper = require('../utils/passwordHelper');
const AppError = require('../errors/appError');

class UserService {
  async createUser({ name, email, password, screenIds = [] }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new AppError('Email already registered', 409);
    }

    const salt = await PasswordHelper.generateSalt();
    const hashedPassword = await PasswordHelper.hash(password, salt);

    const createdUser = await userRepository.create({
      name,
      email,
      password: hashedPassword,
      salt
    });

    if (screenIds.length > 0) {
      await userScreenRepository.replaceUserScreens(createdUser.user_id, screenIds);
    }

    return createdUser;
  }

  async getUserById(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  async listUsers() {
    return userRepository.findAll();
  }

  async updateUser(userId, { name, email }) {
    if (email) {
      const existing = await userRepository.findByEmail(email);
      if (existing && existing.user_id !== userId) {
        throw new AppError('Email already registered', 409);
      }
    }

    const updated = await userRepository.update(userId, { name, email });
    if (!updated) {
      throw new AppError('User not found', 404);
    }
    return updated;
  }

  async deleteUser(userId) {
    const deleted = await userRepository.delete(userId);
    if (!deleted) {
      throw new AppError('User not found', 404);
    }
  }

  async getUserScreens(userId) {
    await this.getUserById(userId);
    return userScreenRepository.findScreensByUserId(userId);
  }

  async setUserScreens(userId, screenIds) {
    await this.getUserById(userId);
    await userScreenRepository.replaceUserScreens(userId, screenIds);
    return userScreenRepository.findScreensByUserId(userId);
  }
}

module.exports = new UserService();
