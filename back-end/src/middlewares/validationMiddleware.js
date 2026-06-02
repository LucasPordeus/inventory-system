const AppError = require('../errors/appError');

const validationMiddleware = (schema, source = 'body') => (req, _res, next) => {
  const { error, value } = schema.validate(req[source], {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const message = error.details.map((d) => d.message).join('; ');
    return next(new AppError(message, 422));
  }

  req[source] = value;
  return next();
};

module.exports = validationMiddleware;
