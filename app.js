const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const passport = require('passport');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
// eslint-disable-next-line no-unused-vars
const passportSetup = require('./config/passport-setup');

const userRouter = require('./routes/userRoutes');
const existenceRouter = require('./routes/existenceRoutes');

const app = express();

app.use(passport.initialize());

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());
// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Limit requests from same API
const limiter = rateLimit({
  max: 500000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);
// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
// Serving static files
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const BasriUtils = require('./utils/BasriUtils');
//Simply logs/lists the keys of the req object :)
app.use((req, res, next) => {
  BasriUtils.BasriLogger(req, res);
  next();
});

//Compression
app.use(compression());

app.use(cors());
app.options('*', cors());

app.use('/api/v1/existence', existenceRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
