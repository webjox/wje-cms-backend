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

describe('categories api', () => {
  beforeAll(async () => {
    const url = `mongodb://127.0.0.1:27017/webjox-cms-jest-categories`;
    const connection = await mongoose.createConnection(url, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    await connection.dropDatabase();
    await mongoose.connect(url, { useNewUrlParser: true, useFindAndModify: false });
  });

  let categoryId;

  const defaultData = {
    name: 'Default category',
    slug: 'default-category',
  };

  test('add new category', async () => {
    const result = await api.categories.addCategory(defaultData);
    categoryId = result._id;
    expect(result.name).toEqual(defaultData.name);
  });

  test('get category by Id', async () => {
    const result = await api.categories.getSingleCategory(categoryId);
    expect(result._id).toEqual(categoryId);
  });

  test('get categories', async () => {
    const result = await api.categories.getCategories();
    expect(result[0]._id).toEqual(categoryId);
  });

  test('update category', async () => {
    const result = await api.categories.updateCategory(categoryId, { name: 'Alfa category' });
    expect(result.name).toEqual('Alfa category');
  });

  test('delete category', async () => {
    const result = await api.categories.deleteCategory(categoryId);
    expect(result).toEqual(true);
  });
  // add tests for images
});
