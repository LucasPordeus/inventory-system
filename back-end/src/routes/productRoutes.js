const { Router } = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const asyncHandler = require('../middlewares/asyncHandler');
const validationMiddleware = require('../middlewares/validationMiddleware');
const {
  createProductSchema,
  updateProductSchema
} = require('../middlewares/validationSchemas');

const router = Router();

router.use(authMiddleware);

router.get('/', asyncHandler((req, res) => productController.list(req, res)));
router.get('/:id', asyncHandler((req, res) => productController.getById(req, res)));

router.post(
  '/',
  validationMiddleware(createProductSchema),
  asyncHandler((req, res) => productController.create(req, res))
);

router.put(
  '/:id',
  validationMiddleware(updateProductSchema),
  asyncHandler((req, res) => productController.update(req, res))
);

router.delete('/:id', asyncHandler((req, res) => productController.remove(req, res)));

module.exports = router;
