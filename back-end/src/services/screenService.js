const screenRepository = require('../repositories/screenRepository');
const AppError = require('../errors/appError');

class ScreenService {
  async createScreen({ name, icon, redirect }) {
    const existing = await screenRepository.findByName(name);
    if (existing) {
      throw new AppError('Screen name already exists', 409);
    }
    return screenRepository.create({ name, icon, redirect });
  }

  async getScreenById(screenId) {
    const screen = await screenRepository.findById(screenId);
    if (!screen) {
      throw new AppError('Screen not found', 404);
    }
    return screen;
  }

  async listScreens() {
    return screenRepository.findAll();
  }

  async updateScreen(screenId, payload) {
    const updated = await screenRepository.update(screenId, payload);
    if (!updated) {
      throw new AppError('Screen not found', 404);
    }
    return updated;
  }

  async deleteScreen(screenId) {
    const deleted = await screenRepository.delete(screenId);
    if (!deleted) {
      throw new AppError('Screen not found', 404);
    }
  }
}

module.exports = new ScreenService();
