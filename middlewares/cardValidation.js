const { celebrate, Joi } = require('celebrate');

const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string(),
  }),
});

const cardIdValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
});

module.exports = {
  createCardValidation,
  cardIdValidation,
}