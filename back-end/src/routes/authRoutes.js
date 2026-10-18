const { Router } = require('express');
const authController = require('../controllers/authController');
const asyncHandler = require('../middlewares/asyncHandler');
const validationMiddleware = require('../middlewares/validationMiddleware');
const { loginSchema } = require('../middlewares/validationSchemas');

const router = Router();

router.post(
  '/login',
  validationMiddleware(loginSchema),
  asyncHandler((req, res) => authController.login(req, res))
);

module.exports = router;
