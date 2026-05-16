const { Router } = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const screenRoutes = require('./screenRoutes');

const router = Router();

router.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/screens', screenRoutes);

module.exports = router;
