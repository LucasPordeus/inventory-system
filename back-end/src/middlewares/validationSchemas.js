const Joi = require('joi');

const passwordRule = Joi.string()
  .min(8)
  .max(72)
  .pattern(/[A-Z]/, 'uppercase letter')
  .pattern(/[a-z]/, 'lowercase letter')
  .pattern(/[0-9]/, 'number')
  .required();

const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(150).required(),
  email: Joi.string().email().max(255).required(),
  password: passwordRule,
  role: Joi.string().valid('admin', 'user').default('user'),
  screenIds: Joi.array().items(Joi.number().integer().positive()).default([])
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(150),
  email: Joi.string().email().max(255)
}).min(1);

const setUserScreensSchema = Joi.object({
  screenIds: Joi.array().items(Joi.number().integer().positive()).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const createScreenSchema = Joi.object({
  name: Joi.string().min(2).max(150).required(),
  icon: Joi.string().min(1).max(100).required(),
  redirect: Joi.string().min(1).max(255).required()
});

const updateScreenSchema = Joi.object({
  name: Joi.string().min(2).max(150),
  icon: Joi.string().min(1).max(100),
  redirect: Joi.string().min(1).max(255)
}).min(1);

const createProductSchema = Joi.object({
  name: Joi.string().min(1).max(150).required(),
  quantity: Joi.number().integer().min(0).required(),
  unit: Joi.string().max(20).allow(null, ''),
  unitPrice: Joi.number().precision(2).min(0).allow(null),
  category: Joi.string().max(100).allow(null, ''),
  expirationDate: Joi.date().iso().allow(null),
  productImage: Joi.string().allow(null, '')
});

const updateProductSchema = Joi.object({
  name: Joi.string().min(1).max(150),
  quantity: Joi.number().integer().min(0),
  unit: Joi.string().max(20).allow(null, ''),
  unitPrice: Joi.number().precision(2).min(0).allow(null),
  category: Joi.string().max(100).allow(null, ''),
  expirationDate: Joi.date().iso().allow(null),
  productImage: Joi.string().allow(null, '')
}).min(1);

module.exports = {
  createUserSchema,
  updateUserSchema,
  setUserScreensSchema,
  loginSchema,
  createScreenSchema,
  updateScreenSchema,
  createProductSchema,
  updateProductSchema
};
