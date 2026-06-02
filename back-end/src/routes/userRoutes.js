const { Router } = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const selfOrAdminMiddleware = require('../middlewares/selfOrAdminMiddleware');
const asyncHandler = require('../middlewares/asyncHandler');
const validationMiddleware = require('../middlewares/validationMiddleware');
const {
  createUserSchema,
  updateUserSchema,
  setUserScreensSchema
} = require('../middlewares/validationSchemas');

const router = Router();

router.use(authMiddleware);

router.get('/me', asyncHandler((req, res) => userController.me(req, res)));

router.get('/', adminMiddleware, asyncHandler((req, res) => userController.list(req, res)));

router.post(
  '/',
  adminMiddleware,
  validationMiddleware(createUserSchema),
  asyncHandler((req, res) => userController.create(req, res))
);

router.get('/:id', selfOrAdminMiddleware, asyncHandler((req, res) => userController.getById(req, res)));

router.put(
  '/:id',
  selfOrAdminMiddleware,
  validationMiddleware(updateUserSchema),
  asyncHandler((req, res) => userController.update(req, res))
);

router.delete('/:id', adminMiddleware, asyncHandler((req, res) => userController.remove(req, res)));

router.get('/:id/screens', adminMiddleware, asyncHandler((req, res) => userController.getScreens(req, res)));

router.put(
  '/:id/screens',
  adminMiddleware,
  validationMiddleware(setUserScreensSchema),
  asyncHandler((req, res) => userController.setScreens(req, res))
);

module.exports = router;
