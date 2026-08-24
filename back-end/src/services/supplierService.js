const supplierRepository = require('../repositories/supplierRepository');
const AppError = require('../errors/appError');

class SupplierService {
  async createSupplier(payload) {
    return supplierRepository.create(payload);
  }

  async getSupplierById(supplierId) {
    const supplier = await supplierRepository.findById(supplierId);
    if (!supplier) {
      throw new AppError('Supplier not found', 404);
    }
    return supplier;
  }

  async listSuppliers() {
    return supplierRepository.findAll();
  }

  async updateSupplier(supplierId, payload) {
    const updated = await supplierRepository.update(supplierId, payload);
    if (!updated) {
      throw new AppError('Supplier not found', 404);
    }
    return updated;
  }

  async deleteSupplier(supplierId) {
    const deleted = await supplierRepository.delete(supplierId);
    if (!deleted) {
      throw new AppError('Supplier not found', 404);
    }
  }
}

module.exports = new SupplierService();