require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const limiter = require('./middlewares/rate-limiter');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { errorHandler } = require('./middlewares/error-handler');
const { validateSignIn, validateSignUp } = require('./middlewares/validators');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const router = require('./routes');

const { PORT = 3000 } = process.env.PORT;
const { MONGOURL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env.MONGOURL;
const { ORIGINS = 'http://localhost' } = process.env.ORIGINS;

const app = express();

app.use(limiter);

app.use(
  cors({
    origin: ORIGINS,
    optionsSuccessStatus: 200,
  })
);

app.use(helmet());

app.use(requestLogger);

mongoose.connect(MONGOURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());

app.post('/signin', validateSignIn, login);

app.post('/signup', validateSignUp, createUser);

app.use(auth);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
