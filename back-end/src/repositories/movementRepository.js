const { query } = require('../config/database');

class MovementRepository {
  async create({ quantity, direction, status, userId, productId }) {
    const sql = `
      INSERT INTO movements (quantity, direction, status, user_id, product_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING movement_id, quantity, direction, status, user_id, product_id, created_at
    `;
    const { rows } = await query(sql, [quantity, direction, status, userId, productId]);
    return rows[0];
  }

  async findById(movementId) {
    const sql = `
      SELECT movement_id, quantity, direction, status, user_id, product_id, created_at
      FROM movements
      WHERE movement_id = $1
    `;
    const { rows } = await query(sql, [movementId]);
    return rows[0] || null;
  }

  async findAll() {
    const sql = `
      SELECT movement_id, quantity, direction, status, user_id, product_id, created_at
      FROM movements
      ORDER BY movement_id ASC
    `;
    const { rows } = await query(sql);
    return rows;
  }

  async update(movementId, { quantity, direction, status }) {
    const sql = `
      UPDATE movements
         SET quantity   = COALESCE($2, quantity),
             direction  = COALESCE($3, direction),
             status     = COALESCE($4, status),
             updated_at = NOW()
       WHERE movement_id = $1
       RETURNING movement_id, quantity, direction, status, user_id, product_id, updated_at
    `;
    const { rows } = await query(sql, [movementId, quantity, direction, status]);
    return rows[0] || null;
  }

  async delete(movementId) {
    const sql = `DELETE FROM movements WHERE movement_id = $1`;
    const result = await query(sql, [movementId]);
    return result.rowCount > 0;
  }
}

module.exports = new MovementRepository();
