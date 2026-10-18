const productService = require('../services/productService');

class ProductController {
  async create(req, res) {
    const product = await productService.createProduct(req.body);
    return res.status(201).json(product);
  }

  async list(_req, res) {
    const products = await productService.listProducts();
    return res.status(200).json(products);
  }

  async getById(req, res) {
    const productId = Number(req.params.id);
    const product = await productService.getProductById(productId);
    return res.status(200).json(product);
  }

  async update(req, res) {
    const productId = Number(req.params.id);
    const updated = await productService.updateProduct(productId, req.body);
    return res.status(200).json(updated);
  }

  async remove(req, res) {
    const productId = Number(req.params.id);
    await productService.deleteProduct(productId);
    return res.status(204).send();
  }
}

module.exports = new ProductController();
