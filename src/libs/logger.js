import winston from 'winston';

const LOGS_FILE = 'logs/server.log';
const ERRORS_FILE = 'logs/errors.log';
const DEV_LOGS_FILE = 'logs/dev-logs.log';

winston.configure({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
      filename: DEV_LOGS_FILE,
    }),
    new winston.transports.File({
      level: 'info',
      handleExceptions: true,
      format: winston.format.json(),
      filename: LOGS_FILE,
    }),
    new winston.transports.File({
      level: 'error',
      handleExceptions: true,
      format: winston.format.json(),
      filename: ERRORS_FILE,
    }),
  ],
});

const getResponse = message => ({
  error: true,
  message,
});

const logUnauthorizedRequests = req => {
  // todo
};

const sendResponse = (err, ctx, next) => {
  if (err && err.name === 'UnauthorizedError') {
    logUnauthorizedRequests(ctx);
    ctx.status = 401;
    ctx.body = err.message;
  } else if (err) {
    winston.error(err.stack);
    ctx.status = 500;
    ctx.body = err.message;
  } else {
    next();
  }
};

export default {
  sendResponse,
};
