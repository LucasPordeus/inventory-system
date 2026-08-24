const { Router } = require('express');
const supplierController = require('../controllers/supplierController');
const authMiddleware = require('../middlewares/authMiddleware');
const asyncHandler = require('../middlewares/asyncHandler');
const validationMiddleware = require('../middlewares/validationMiddleware');
const {
  createSupplierSchema,
  updateSupplierSchema
} = require('../middlewares/validationSchemas');

const router = Router();

router.use(authMiddleware);

router.get('/', asyncHandler((req, res) => supplierController.list(req, res)));
router.get('/:id', asyncHandler((req, res) => supplierController.getById(req, res)));

router.post(
  '/',
  validationMiddleware(createSupplierSchema),
  asyncHandler((req, res) => supplierController.create(req, res))
);

router.put(
  '/:id',
  validationMiddleware(updateSupplierSchema),
  asyncHandler((req, res) => supplierController.update(req, res))
);

router.delete('/:id', asyncHandler((req, res) => supplierController.remove(req, res)));

module.exports = router;
