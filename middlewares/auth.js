const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/unauthorized-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new Unauthorized('Необходима авторизация');
    }
    let payload;
    const token = authorization.replace('Bearer ', '');
    try {
      payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'super-secret-jwt');
    } catch (err) {
      throw new ForbiddenError('Недостаточно прав для выполнения действия');
    }
    req.user = payload;
  } catch (err) {
    next(err);
  }
  next();
};
