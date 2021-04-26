import mongoose from 'mongoose';
import winston from 'winston';
import api from '../src/services/api';

const LOGS_FILE = 'logs/server-test.log';
const ERRORS_FILE = 'logs/errors-test.log';
const DEV_LOGS_FILE = 'logs/dev-logs-test.log';

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

describe('Payment Methods Api', () => {
  beforeAll(async () => {
    const url = `mongodb://127.0.0.1:27017/webjox-cms-jest-payment-methods`;
    const connection = await mongoose.createConnection(url, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    await connection.dropDatabase();
    await mongoose.connect(url, { useNewUrlParser: true, useFindAndModify: false });
  });

  let paymentId;

  const defaultData = {
    name: 'DefaultName',
  };

  test('create new payment method', async () => {
    const result = await api.paymentMethods.createMethod(defaultData);
    paymentId = result._id;
    expect(result.name).toEqual(defaultData.name);
  });

  test('get method by id', async () => {
    const result = await api.paymentMethods.getMethodById(paymentId);
    expect(result._id).toEqual(paymentId);
  });

  test('get methods', async () => {
    const result = await api.paymentMethods.getMethods();
    expect(result[0]._id).toEqual(paymentId);
  });

  test('update method', async () => {
    const result = await api.paymentMethods.updateMethod(paymentId, { name: 'Alfa method' });
    expect(result.name).toEqual('Alfa method');
  });

  test('delete method', async () => {
    const result = await api.paymentMethods.deleteMethod(paymentId);
    expect(result.status).toEqual('success');
  });
});
