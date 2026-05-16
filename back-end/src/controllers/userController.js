const userService = require('../services/userService');

class UserController {
  async create(req, res) {
    const user = await userService.createUser(req.body);
    return res.status(201).json(user);
  }

  async list(_req, res) {
    const users = await userService.listUsers();
    return res.status(200).json(users);
  }

  async getById(req, res) {
    const userId = Number(req.params.id);
    const user = await userService.getUserById(userId);
    return res.status(200).json(user);
  }

  async update(req, res) {
    const userId = Number(req.params.id);
    const updated = await userService.updateUser(userId, req.body);
    return res.status(200).json(updated);
  }

  async remove(req, res) {
    const userId = Number(req.params.id);
    await userService.deleteUser(userId);
    return res.status(204).send();
  }

  async getScreens(req, res) {
    const userId = Number(req.params.id);
    const screens = await userService.getUserScreens(userId);
    return res.status(200).json(screens);
  }

  async setScreens(req, res) {
    const userId = Number(req.params.id);
    const { screenIds } = req.body;
    const screens = await userService.setUserScreens(userId, screenIds);
    return res.status(200).json(screens);
  }

  async me(req, res) {
    const user = await userService.getUserById(req.user.userId);
    const screens = await userService.getUserScreens(req.user.userId);
    return res.status(200).json({ user, screens });
  }
}

module.exports = new UserController();
