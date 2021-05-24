const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-reques-err');
const ConflictError = require('../errors/conflict-err');

const getLoggedInUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .orFail(new NotFoundError('Пользователь с указанным _id не найден'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Невалидный id'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    if (!validator.isEmail(email)) {
      throw new BadRequestError('Неверный формат электронной почты');
    }
  } catch (err) {
    next(err);
  }
  bcrypt.hash(password, 10).then((hash) => {
    const userBluprint = {
      name,
      email,
      password: hash,
    };
    const resultBluprint = {};
    Object.keys(userBluprint).forEach((key) => {
      if (userBluprint[key]) {
        resultBluprint[key] = userBluprint[key];
      }
    });
    User.create(resultBluprint)
      .then((user) => res.status(201).send({ data: user.toJSON() }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequestError('Неверено задано одно из полей'));
        } else if (err.name === 'MongoError' && err.code === 11000) {
          next(new ConflictError('Пользователь с указанной почтой уже существует в базе данных'));
        } else {
          next(err);
        }
      });
  });
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true })
    .orFail(new NotFoundError('Пользователь с указанным _id не найден'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Неверено задано одно из полей'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Невалидный id'));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictError('Пользователь с указанной почтой уже существует в базе данных'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'super-secret-jwt',
      );
      res
        .status(200)
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getLoggedInUser,
  createUser,
  updateUser,
  login,
};
