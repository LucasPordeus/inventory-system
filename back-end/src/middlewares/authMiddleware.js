const JwtHelper = require('../utils/jwtHelper');
const AppError = require('../errors/appError');

const authMiddleware = (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authorization token not provided', 401));
  }

  const token = authHeader.split(' ')[1];
  const payload = JwtHelper.verify(token);

  req.user = { userId: payload.userId, email: payload.email, role: payload.role };
  return next();
};

module.exports = authMiddleware;
