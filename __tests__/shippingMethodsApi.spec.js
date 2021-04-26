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

describe('Shipping Methods Api', () => {
  beforeAll(async () => {
    const url = `mongodb://127.0.0.1:27017/webjox-cms-jest-shipping-methods`;
    const connection = await mongoose.createConnection(url, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    await connection.dropDatabase();
    await mongoose.connect(url, { useNewUrlParser: true, useFindAndModify: false });
  });

  let shippingId;

  const defaultData = {
    name: 'DefaultName',
  };

  test('create new payment method', async () => {
    const result = await api.shippingMethods.createMethod(defaultData);
    shippingId = result._id;
    expect(result.name).toEqual(defaultData.name);
  });

  test('get method by id', async () => {
    const result = await api.shippingMethods.getMethodById(shippingId);
    expect(result._id).toEqual(shippingId);
  });

  test('get methods', async () => {
    const result = await api.shippingMethods.getMethods();
    expect(result[0]._id).toEqual(shippingId);
  });

  test('update method', async () => {
    const result = await api.shippingMethods.updateMethod(shippingId, { name: 'Alfa method' });
    expect(result.name).toEqual('Alfa method');
  });

  test('delete method', async () => {
    const result = await api.shippingMethods.deleteMethod(shippingId);
    expect(result.status).toEqual('success');
  });
});
