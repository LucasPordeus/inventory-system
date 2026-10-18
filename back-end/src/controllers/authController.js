const authService = require('../services/authService');

class AuthController {
  async login(req, res) {
    const result = await authService.authenticate(req.body);
    return res.status(200).json(result);
  }
}

module.exports = new AuthController();
