const AppError = require('../errors/appError');

const adminMiddleware = (req, _res, next) => {
  if (req.user?.role !== 'admin') {
    return next(new AppError('Forbidden', 403));
  }
  return next();
};

module.exports = adminMiddleware;
