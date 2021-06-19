const express = require('express');
const requestId = require('express-request-id')();
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('./config/logger');
const api = require('./api/v1');

const app = express();

app.use(requestId);
app.use(logger.requests);

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowedHeaders: ['Accept', 'Content-type', 'Authorization'],
  })
);

app.use(express.json());

app.get('/', (req, res, next) => {
  res.json({
    message: 'Welcome to the API',
  });
});

app.use('/api', api);
app.use('/api/v1', api);

app.use((req, res, next) => {
  next({
    message: 'Route not found',
    statusCode: 404,
    level: 'warn',
  });
});

// error handler
app.use((err, req, res, next) => {
  const { message, level = 'error' } = err;
  let { statusCode = 500 } = err;
  const log = `${logger.header(req)} ${statusCode} ${message}`;

  // Validation Errors
  if (err.message.startsWith('ValidationError')) {
    statusCode = 422;
  }

  logger[level](log);

  res.status(statusCode);
  res.json({
    error: true,
    statusCode,
    message,
  });
});

module.exports = app;
