const { Router } = require('express');
const screenController = require('../controllers/screenController');
const authMiddleware = require('../middlewares/authMiddleware');
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
  validationMiddleware(createScreenSchema),
  asyncHandler((req, res) => screenController.create(req, res))
);

router.put(
  '/:id',
  validationMiddleware(updateScreenSchema),
  asyncHandler((req, res) => screenController.update(req, res))
);

router.delete('/:id', asyncHandler((req, res) => screenController.remove(req, res)));

module.exports = router;
