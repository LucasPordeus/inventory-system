const { query } = require('../config/database');

class ProductRepository {
  async create({ name, quantity, unit, unitPrice, category, expirationDate, productImage }) {
    const sql = `
      INSERT INTO products (name, quantity, unit, unit_price, category, expiration_date, product_image)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING product_id, name, quantity, unit, unit_price, category, expiration_date, product_image
    `;
    const { rows } = await query(sql, [name, quantity, unit, unitPrice, category, expirationDate, productImage]);
    return rows[0];
  }

  async findById(productId) {
    const sql = `
      SELECT product_id, name, quantity, unit, unit_price, category, expiration_date, product_image
      FROM products
      WHERE product_id = $1
    `;
    const { rows } = await query(sql, [productId]);
    return rows[0] || null;
  }

  async findAll() {
    const sql = `
      SELECT product_id, name, quantity, unit, unit_price, category, expiration_date, product_image
      FROM products
      ORDER BY product_id ASC
    `;
    const { rows } = await query(sql);
    return rows;
  }

  async update(productId, { name, quantity, unit, unitPrice, category, expirationDate, productImage }) {
    const sql = `
      UPDATE products
         SET name             = COALESCE($2, name),
             quantity         = COALESCE($3, quantity),
             unit             = COALESCE($4, unit),
             unit_price       = COALESCE($5, unit_price),
             category         = COALESCE($6, category),
             expiration_date  = COALESCE($7, expiration_date),
             product_image    = COALESCE($8, product_image),
             updated_at       = NOW()
       WHERE product_id = $1
       RETURNING product_id, name, quantity, unit, unit_price, category, expiration_date, product_image
    `;
    const { rows } = await query(sql, [
      productId,
      name,
      quantity,
      unit,
      unitPrice,
      category,
      expirationDate,
      productImage
    ]);
    return rows[0] || null;
  }

  async delete(productId) {
    const sql = `DELETE FROM products WHERE product_id = $1`;
    const result = await query(sql, [productId]);
    return result.rowCount > 0;
  }
}

module.exports = new ProductRepository();
