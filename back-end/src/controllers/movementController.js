const movementService = require('../services/movementService');

class MovementController {
  async create(req, res) {
    const movement = await movementService.createMovement(req.body);
    return res.status(201).json(movement);
  }

  async list(_req, res) {
    const movements = await movementService.listMovements();
    return res.status(200).json(movements);
  }

  async getById(req, res) {
    const movementId = Number(req.params.id);
    const movement = await movementService.getMovementById(movementId);
    return res.status(200).json(movement);
  }

  async update(req, res) {
    const movementId = Number(req.params.id);
    const updated = await movementService.updateMovement(movementId, req.body);
    return res.status(200).json(updated);
  }

  async remove(req, res) {
    const movementId = Number(req.params.id);
    await movementService.deleteMovement(movementId);
    return res.status(204).send();
  }
}

module.exports = new MovementController();
