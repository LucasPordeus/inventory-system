const movementRepository = require('../repositories/movementRepository');
const userRepository = require('../repositories/userRepository');
const productRepository = require('../repositories/productRepository');
const AppError = require('../errors/appError');

class MovementService {
  async createMovement({ quantity, direction, status, userId, productId }) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const product = await productRepository.findById(productId);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return movementRepository.create({ quantity, direction, status, userId, productId });
  }

  async getMovementById(movementId) {
    const movement = await movementRepository.findById(movementId);
    if (!movement) {
      throw new AppError('Movement not found', 404);
    }
    return movement;
  }

  async listMovements() {
    return movementRepository.findAll();
  }

  async updateMovement(movementId, payload) {
    const updated = await movementRepository.update(movementId, payload);
    if (!updated) {
      throw new AppError('Movement not found', 404);
    }
    return updated;
  }

  async deleteMovement(movementId) {
    const deleted = await movementRepository.delete(movementId);
    if (!deleted) {
      throw new AppError('Movement not found', 404);
    }
  }
}

module.exports = new MovementService();
