const AppError = require('../errors/appError');

const selfOrAdminMiddleware = (req, _res, next) => {
  const targetId = Number(req.params.id);
  if (req.user?.role === 'admin' || req.user?.userId === targetId) {
    return next();
  }
  return next(new AppError('Forbidden', 403));
};

module.exports = selfOrAdminMiddleware;
