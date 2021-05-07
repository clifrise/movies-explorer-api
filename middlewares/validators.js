const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const validateSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().messages({
      'any.required': '{#label} обязательное поле!',
    }),
    password: Joi.string().required().min(6).messages({
      'string.min': 'Поле {#label} должно быть не меньше {#limit} символов!',
      'any.required': '{#label} обязательное поле!',
    }),
  }),
});

const validateSignUp = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'any.required': '{#label} обязательное поле!',
        'string.min': 'Поле {#label} должно быть не меньше {#limit} символов!',
        'string.max': 'Поле {#label} должно быть не больше {#limit} символов!',
      }),
    email: Joi.string().required().messages({
      'any.required': '{#label} обязательное поле!',
    }),
    password: Joi.string().required().min(6).messages({
      'string.min': 'Поле {#label} должно быть не меньше {#limit} символов!',
      'any.required': '{#label} обязательное поле!',
    }),
  }),
});

const validateGetLoggedInUser = celebrate({
  headers: Joi.object()
    .keys({
      'content-type': Joi.string().valid('application/json').required().messages({
        'string.valid': 'Поле {#label} должно иметь значение application/json!',
        'string.required': '{#label} обязательное поле!',
      }),
    })
    .unknown(),
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': 'Поле {#label} должно быть не меньше {#limit} символов!',
        'string.max': 'Поле {#label} должно быть не больше {#limit} символов!',
        'string.required': '{#label} обязательное поле!',
      }),
    email: Joi.string()
      .custom((value, helpers) => {
        if (validator.isEmail(value)) {
          return value;
        }
        return helpers.message('Поле "email" должно быть валидным электронным адресом');
      })
      .messages({
        'string.min': 'Поле {#label} должно быть не меньше {#limit} символов!',
        'string.max': 'Поле {#label} должно быть не больше {#limit} символов!',
        'string.required': '{#label} обязательное поле!',
      }),
  }),
  headers: Joi.object()
    .keys({
      'content-type': Joi.string().valid('application/json').required().messages({
        'string.valid': 'Поле {#label} должно иметь значение application/json!',
        'string.required': '{#label} обязательное поле!',
      }),
    })
    .unknown(),
});

const validateGetMovies = celebrate({
  headers: Joi.object()
    .keys({
      'content-type': Joi.string().valid('application/json').required().messages({
        'string.valid': 'Поле {#label} должно иметь значение application/json!',
        'string.required': '{#label} обязательное поле!',
      }),
    })
    .unknown(),
});

const validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).messages({
      'string.min': 'Поле {#label} должно быть не меньше {#limit} символов!',
      'string.required': '{#label} обязательное поле!',
    }),
    director: Joi.string().required().min(2).messages({
      'string.min': 'Поле {#label} должно быть не меньше {#limit} символов!',
      'string.required': '{#label} обязательное поле!',
    }),
    duration: Joi.number().required().min(2).messages({
      'string.min': 'Поле {#label} должно быть не меньше {#limit} символов!',
      'string.required': '{#label} обязательное поле!',
    }),
    year: Joi.string().required().min(2).max(4)
      .messages({
        'string.min': 'Поле {#label} должно быть не меньше {#limit} символов!',
        'string.max': 'Поле {#label} должно быть не больше {#limit} символов!',
        'string.required': '{#label} обязательное поле!',
      }),
    description: Joi.string().required().min(2).messages({
      'string.min': 'Поле {#label} должно быть не меньше {#limit} символов!',
      'string.required': '{#label} обязательное поле!',
    }),
    image: Joi.string()
      .custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message('Поле "image" должно быть валидным url-адресом');
      })
      .messages({
        'any.required': 'Поле "image" должно быть заполнено',
      }),
    trailer: Joi.string()
      .custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message('Поле "trailer" должно быть валидным url-адресом');
      })
      .messages({
        'any.required': 'Поле "trailer" должно быть заполнено',
      }),
    nameRU: Joi.string().required().min(2).messages({
      'string.min': 'Поле {#label} должно быть не меньше {#limit} символов!',
      'string.required': '{#label} обязательное поле!',
    }),
    nameEN: Joi.string().required().min(2).messages({
      'string.min': 'Поле {#label} должно быть не меньше {#limit} символов!',
      'string.required': '{#label} обязательное поле!',
    }),
    thumbnail: Joi.string()
      .custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message('Поле "thumbnail" должно быть валидным url-адресом');
      })
      .messages({
        'any.required': 'Поле "thumbnail" должно быть заполнено',
      }),
    movieId: Joi.string().required().min(2).messages({
      'string.min': 'Поле {#label} должно быть не меньше {#limit} символов!',
      'string.required': '{#label} обязательное поле!',
    }),
  }),
  headers: Joi.object()
    .keys({
      'content-type': Joi.string().valid('application/json').required().messages({
        'string.valid': 'Поле {#label} должно иметь значение application/json!',
        'string.required': '{#label} обязательное поле!',
      }),
    })
    .unknown(),
});

const validateDeleteMovie = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).messages({
      'string.hex': 'Поле {#label} должно быть шестнадцатиричной строкой!',
      'string.length': 'Поле {#label} должно быть длиной 24 символа!',
    }),
  }),
  headers: Joi.object()
    .keys({
      'content-type': Joi.string().valid('application/json').required().messages({
        'string.valid': 'Поле {#label} должно иметь значение application/json!',
        'string.required': '{#label} обязательное поле!',
      }),
    })
    .unknown(),
});

module.exports = {
  validateSignIn,
  validateSignUp,
  validateGetLoggedInUser,
  validateUpdateUser,
  validateGetMovies,
  validateCreateMovie,
  validateDeleteMovie,
};
