const router = require('express').Router();

const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateSignIn, validateSignUp } = require('../middlewares/validators');
const NotFoundError = require('../errors/not-found-err');

const userRouter = require('./users');
const movieRouter = require('./movies');

router.post('/signin', validateSignIn, login);

router.post('/signup', validateSignUp, createUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use((req, res, next) => {
  next(new NotFoundError(`Ресурс по адресу ${req.path} не найден`));
});

module.exports = router;
