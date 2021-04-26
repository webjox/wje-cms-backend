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

describe('pages api', () => {
  beforeAll(async () => {
    const url = `mongodb://127.0.0.1:27017/webjox-cms-shops`;
    const connection = await mongoose.createConnection(url, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    await connection.dropDatabase();
    await mongoose.connect(url, { useNewUrlParser: true, useFindAndModify: false });
  });

  let shopId;
  const defaultData = {
    name: 'Default shop',
  };

  test('add new shop', async () => {
    const result = await api.shops.addShop(defaultData);
    shopId = result._id;
    expect(result.name).toEqual(defaultData.name);
  });

  test('get shop by id', async () => {
    const result = await api.shops.getShopById(shopId);
    expect(result._id).toEqual(shopId);
  });

  test('get shops', async () => {
    const result = await api.shops.getShops();
    expect(result[0]._id).toEqual(shopId);
  });

  test('update shop', async () => {
    const result = await api.shops.updateShop(shopId, { warehouse: true });
    expect(result.warehouse).toEqual(true);
  });

  test('delete shop', async () => {
    const result = await api.shops.deleteShop(shopId);
    expect(result.status).toEqual('success');
  });
});
