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

describe('orders api tests', () => {
  beforeAll(async () => {
    const url = `mongodb://127.0.0.1:27017/webjox-cms-jest-orders`;
    const connection = await mongoose.createConnection(url, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    await connection.dropDatabase();
    await mongoose.connect(url, { useNewUrlParser: true, useFindAndModify: false });
  });

  let orderId;

  const defaultData = {
    address: 'alfa address',
    city: 'alfa city',
    phone: '+71234567890',
    first_name: 'Alkes',
    last_name: 'Alfa',
    email: 'alfamail@gmail.com',
    mobile: '+71234567890',
    note: 'alfa note',
    coupon: 'ALFA',
  };

  test('create order', async () => {
    const result = await api.orders.addOrder(defaultData);
    orderId = result._id;
    expect(result.email).toEqual(defaultData.email);
  });

  test('get order', async () => {
    const result = await api.orders.getSingleOrder(orderId);
    expect(result.email).toEqual(defaultData.email);
  });

  test('get orders', async () => {
    const result = await api.orders.getOrders();
    expect(result.data[0].email).toEqual(defaultData.email);
  });

  test('update order', async () => {
    const result = await api.orders.updateOrder(orderId, { full_name: 'Alexey Nazarov' });
    expect(result.full_name).toEqual('Alexey Nazarov');
  });

  test('auto increment order number', async () => {
    const result = await api.orders.addOrder({});
    expect(result.number).toEqual(1001);
  });

  test('change cancel order status', async () => {
    const result = await api.orders.cancelOrder(orderId);
    expect(result.cancelled).toEqual(true);
    expect(typeof result.date_closed).toEqual('object');
  });

  test('checkout order', async () => {
    // need shop_id
    const result = await api.orders.checkoutOrder(orderId);
    expect(result.draft).toEqual(false);
  });

  test('delete order', async () => {
    const result = await api.orders.deleteOrder(orderId);
    expect(result.status).toEqual('success');
  });
});
