const productRepository = require('../repositories/productRepository');
const AppError = require('../errors/appError');

class ProductService {
  async createProduct(payload) {
    return productRepository.create(payload);
  }

  async getProductById(productId) {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  }

  async listProducts() {
    return productRepository.findAll();
  }

  async updateProduct(productId, payload) {
    const updated = await productRepository.update(productId, payload);
    if (!updated) {
      throw new AppError('Product not found', 404);
    }
    return updated;
  }

  async deleteProduct(productId) {
    const deleted = await productRepository.delete(productId);
    if (!deleted) {
      throw new AppError('Product not found', 404);
    }
  }
}

module.exports = new ProductService();
