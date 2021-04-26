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

describe('order items api', () => {
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

  let defaultData;
  let order;
  let product;
  let itemId;

  test('add new item', async () => {
    order = await api.orders.addOrder({});
    product = await api.products.addProduct({
      name: 'chair',
      price: 2000,
      stock_price: 1000,
      stock_quantity: 100,
    });

    defaultData = {
      product_image: product ? product.images[0] : null,
      product_id: product._id,
      quantity: 1,
      sku: product.sku,
      price: product.price,
      stock_price: product.stock_price,
    };

    const result = await api.orderItems.addItem(order._id, defaultData);
    const { items } = result;
    itemId = items[0]._id;
    expect(items[0].product_id).toEqual(product._id);
  });

  test('add exist item', async () => {
    const result = await api.orderItems.addItem(order._id, defaultData);
    const { items } = result;
    expect(items[0].quantity).toBe(2);
  });

  test('get available product quantity', async () => {
    const result = await api.orderItems.getAvailableProductQuantity(product._id, null, 2);
    expect(result).toBe(2);
  });

  test('get order item if exist', async () => {
    const result = await api.orderItems.getOrderItemIfExists(order._id, product._id);
    expect(result.sku).toEqual(product.sku);
  });

  test('update item', async () => {
    const result = await api.orderItems.updateItem(order._id, itemId, { discount_total: 10 });
    expect(result.items[0].price_total).toBe(4000);
    expect(result.items[0].stock_price_total).toBe(2000);
  });

  test('apply discount for items', async () => {
    const result = await api.orderItems.calculateAndUpdateAllItems(order._id, true);
    expect(result.items[0].price_total).toBe(3600);
    expect(result.items[0].stock_price_total).toBe(1800);
  });

  test('delete item', async () => {
    const result = await api.orderItems.deleteItem(order._id, itemId);
    expect(result.items.length).toBe(0);
  });
});
