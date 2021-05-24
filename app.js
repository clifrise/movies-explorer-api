require('dotenv').config();

const { NODE_ENV, MONGOURLPROD, MONGOURLDEV } = process.env;
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const limiter = require('./middlewares/rate-limiter');
const { errorHandler } = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const router = require('./routes');

const { PORT = 3000 } = process.env;
const { ORIGINS = 'http://localhost' } = process.env;

const app = express();

app.use(requestLogger);

app.use(limiter);

app.use(
  cors({
    origin: ORIGINS,
    optionsSuccessStatus: 200,
  }),
);

app.use(helmet());

mongoose.connect(NODE_ENV === 'production' ? MONGOURLPROD : MONGOURLDEV, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
