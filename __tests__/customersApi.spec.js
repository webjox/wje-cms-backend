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

describe('customers api', () => {
  beforeAll(async () => {
    const url = `mongodb://127.0.0.1:27017/webjox-cms-jest-customers`;
    const connection = await mongoose.createConnection(url, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    await connection.dropDatabase();
    await mongoose.connect(url, { useNewUrlParser: true, useFindAndModify: false });
  });

  let customerId;
  const defaultData = {
    email: 'test@mail.ru',
    password: '12345',
    fullName: 'Алексеев Алексей Алексеевич',
  };

  test('add new customer', async () => {
    const result = await api.customers.addCustomer(defaultData);
    customerId = result._id;
    expect(result.email).toEqual(defaultData.email);
  });

  test('get customer sum orders for year', async () => {
    const result = await api.customers.getOrderSumForYear(customerId);
    expect(result).toBe(0);
  });

  test('get user discount from sum', async () => {
    const result = await api.customers.getUserDiscountFromSum(32000, true);
    expect(result).toBe(5);
  });

  test('get customer by id', async () => {
    const result = await api.customers.getSingleCustomer(customerId);
    expect(result._id).toEqual(customerId);
  });

  test('update customer statistics', async () => {
    const result = await api.customers.updateCustomerStatistics(customerId, 20000, 4);
    expect(result.total_spent).toBe(20000);
    expect(result.orders_count).toBe(4);
  });

  test('update customer', async () => {
    const result = await api.customers.updateCustomer(customerId, { email: 'alfatest@mail.com' });
    expect(result.email).toEqual('alfatest@mail.com');
  });

  test('delete customer', async () => {
    const result = await api.customers.deleteCustomer(customerId);
    expect(result.status).toEqual('success');
  });
});
