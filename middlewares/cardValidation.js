const { celebrate, Joi } = require('celebrate');
const { regEx } = require('../utils/constants');

const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().regex(regEx),
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