const { Router } = require('express');
const movementController = require('../controllers/movementController');
const authMiddleware = require('../middlewares/authMiddleware');
const asyncHandler = require('../middlewares/asyncHandler');
const validationMiddleware = require('../middlewares/validationMiddleware');
const {
  createMovementSchema,
  updateMovementSchema
} = require('../middlewares/validationSchemas');

const router = Router();

router.use(authMiddleware);

router.get('/', asyncHandler((req, res) => movementController.list(req, res)));
router.get('/:id', asyncHandler((req, res) => movementController.getById(req, res)));

router.post(
  '/',
  validationMiddleware(createMovementSchema),
  asyncHandler((req, res) => movementController.create(req, res))
);

router.put(
  '/:id',
  validationMiddleware(updateMovementSchema),
  asyncHandler((req, res) => movementController.update(req, res))
);

router.delete('/:id', asyncHandler((req, res) => movementController.remove(req, res)));

module.exports = router;
