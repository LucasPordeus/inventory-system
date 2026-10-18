const screenService = require('../services/screenService');

class ScreenController {
  async create(req, res) {
    const screen = await screenService.createScreen(req.body);
    return res.status(201).json(screen);
  }

  async list(_req, res) {
    const screens = await screenService.listScreens();
    return res.status(200).json(screens);
  }

  async getById(req, res) {
    const screenId = Number(req.params.id);
    const screen = await screenService.getScreenById(screenId);
    return res.status(200).json(screen);
  }

  async update(req, res) {
    const screenId = Number(req.params.id);
    const updated = await screenService.updateScreen(screenId, req.body);
    return res.status(200).json(updated);
  }

  async remove(req, res) {
    const screenId = Number(req.params.id);
    await screenService.deleteScreen(screenId);
    return res.status(204).send();
  }
}

module.exports = new ScreenController();
