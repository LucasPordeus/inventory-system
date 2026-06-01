const { Router } = require('express');
const screenController = require('../controllers/screenController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const asyncHandler = require('../middlewares/asyncHandler');
const validationMiddleware = require('../middlewares/validationMiddleware');
const {
  createScreenSchema,
  updateScreenSchema
} = require('../middlewares/validationSchemas');

const router = Router();

router.use(authMiddleware);

router.get('/', asyncHandler((req, res) => screenController.list(req, res)));
router.get('/:id', asyncHandler((req, res) => screenController.getById(req, res)));

router.post(
  '/',
  adminMiddleware,
  validationMiddleware(createScreenSchema),
  asyncHandler((req, res) => screenController.create(req, res))
);

router.put(
  '/:id',
  adminMiddleware,
  validationMiddleware(updateScreenSchema),
  asyncHandler((req, res) => screenController.update(req, res))
);

router.delete('/:id', adminMiddleware, asyncHandler((req, res) => screenController.remove(req, res)));

module.exports = router;
