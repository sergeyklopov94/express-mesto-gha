const { celebrate, Joi } = require('celebrate');

const createUserValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
  }),
});

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const userIdValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
});

const updateUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const updateAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
});

module.exports = {
  createUserValidation,
  loginValidation,
  userIdValidation,
  updateUserValidation,
  updateAvatarValidation,
}