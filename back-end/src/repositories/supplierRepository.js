const { query } = require('../config/database');

class SupplierRepository {
  async create({ name, contact, cnpj, category }) {
    const sql = `
      INSERT INTO suppliers (name, contact, cnpj, category)
      VALUES ($1, $2, $3, $4)
      RETURNING supplier_id, name, contact, cnpj, category
    `;
    const { rows } = await query(sql, [name, contact, cnpj, category]);
    return rows[0];
  }

  async findById(supplierId) {
    const sql = `
      SELECT supplier_id, name, contact, cnpj, category
      FROM suppliers
      WHERE supplier_id = $1
    `;
    const { rows } = await query(sql, [supplierId]);
    return rows[0] || null;
  }

  async findAll() {
    const sql = `
      SELECT supplier_id, name, contact, cnpj, category
      FROM suppliers
      ORDER BY supplier_id ASC
    `;
    const { rows } = await query(sql);
    return rows;
  }

  async update(supplierId, { name, contact, cnpj, category }) {
    const sql = `
      UPDATE suppliers
         SET name             = COALESCE($2, name),
             contact          = COALESCE($3, contact), 
             cnpj             = COALESCE($4, cnpj),
             category         = COALESCE($5, category),
             updated_at       = NOW()
       WHERE supplier_id = $1
       RETURNING supplier_id, name, contact, cnpj, category
    `;
    const { rows } = await query(sql, [
      supplierId,
      name,
      contact,
      cnpj,
      category
    ]);
    return rows[0] || null;
  }

  async delete(supplierId) {
    const sql = `DELETE FROM suppliers WHERE supplier_id = $1`;
    const result = await query(sql, [supplierId]);
    return result.rowCount > 0;
  }
}

module.exports = new SupplierRepository();
