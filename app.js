const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const boolParser = require('express-query-boolean');
const { HttpCode } = require('./src/helpers/constants');
const { apiLimiter } = require('./src/helpers/constants');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(helmet());
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json({ limit: 10000 }));
app.use(boolParser());

app.use('/api/', rateLimit(apiLimiter));
app.use('/api/', require('./src/routes/api'));

app.use((req, res) => {
  res
    .status(404)
    .json({ status: 'error', code: HttpCode.NOT_FOUND, message: 'Not found' });
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res
    .status(status)
    .json({ status: 'fail', code: status, message: err.message });
});

module.exports = app;
