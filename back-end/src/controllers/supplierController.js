const supplierService = require('../services/supplierService');

class SupplierController {
  async create(req, res) {
    const supplier = await supplierService.createSupplier(req.body);
    return res.status(201).json(supplier);
  }

  async list(_req, res) {
    const suppliers = await supplierService.listSuppliers();
    return res.status(200).json(suppliers);
  }

  async getById(req, res) {
    const supplierId = Number(req.params.id);
    const supplier = await supplierService.getSupplierById(supplierId);
    return res.status(200).json(supplier);
  }

  async update(req, res) {
    const supplierId = Number(req.params.id);
    const updated = await supplierService.updateSupplier(supplierId, req.body);
    return res.status(200).json(updated);
  }

  async remove(req, res) {
    const supplierId = Number(req.params.id);
    await supplierService.deleteSupplier(supplierId);
    return res.status(204).send();
  }
}

module.exports = new SupplierController();
