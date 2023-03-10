const { celebrate, Joi } = require('celebrate');

// const urlRegEx = /https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-.~:/?#[\]@!$&'()*+,;=]{2,}#?/;

const loginValidate = celebrate({
  body: Joi.object().keys({
    login: Joi.string().required(),
    password: Joi.string().required(),
  }),
});

const registerValidate = celebrate({
  body: Joi.object().keys({
    login: Joi.string().min(8).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const updateProfileValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const validateGetUser = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
});

module.exports = {
  loginValidate,
  registerValidate,
  updateProfileValidate,
  validateGetUser,
};
