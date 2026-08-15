const { Router } = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const screenRoutes = require('./screenRoutes');
const productRoutes = require('./productRoutes');

const router = Router();

router.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/screens', screenRoutes);
router.use('/products', productRoutes);

module.exports = router;
