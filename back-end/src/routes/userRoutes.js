const { Router } = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const asyncHandler = require('../middlewares/asyncHandler');
const validationMiddleware = require('../middlewares/validationMiddleware');
const {
  createUserSchema,
  updateUserSchema,
  setUserScreensSchema
} = require('../middlewares/validationSchemas');

const router = Router();

router.post(
  '/',
  validationMiddleware(createUserSchema),
  asyncHandler((req, res) => userController.create(req, res))
);

router.use(authMiddleware);

router.get('/me', asyncHandler((req, res) => userController.me(req, res)));
router.get('/', asyncHandler((req, res) => userController.list(req, res)));
router.get('/:id', asyncHandler((req, res) => userController.getById(req, res)));

router.put(
  '/:id',
  validationMiddleware(updateUserSchema),
  asyncHandler((req, res) => userController.update(req, res))
);

router.delete('/:id', asyncHandler((req, res) => userController.remove(req, res)));

router.get('/:id/screens', asyncHandler((req, res) => userController.getScreens(req, res)));

router.put(
  '/:id/screens',
  validationMiddleware(setUserScreensSchema),
  asyncHandler((req, res) => userController.setScreens(req, res))
);

module.exports = router;
