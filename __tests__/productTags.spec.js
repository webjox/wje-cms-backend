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

describe('product tags api', () => {
  beforeAll(async () => {
    const url = `mongodb://127.0.0.1:27017/webjox-cms-jest-product-tags`;
    const connection = await mongoose.createConnection(url, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    await connection.dropDatabase();
    await mongoose.connect(url, { useNewUrlParser: true, useFindAndModify: false });
  });

  let tagId;
  const defaultData = {
    name: 'Default name',
    position: 1,
  };

  test('add new tag', async () => {
    const result = await api.productTags.createTag(defaultData);
    tagId = result._id;
    expect(result.name).toEqual(defaultData.name);
  });

  test('get tag by id', async () => {
    const result = await api.productTags.getTagById(tagId);
    expect(result._id).toEqual(tagId);
  });

  test('get tags', async () => {
    const result = await api.productTags.getTags();
    expect(result[0]._id).toEqual(tagId);
  });

  test('update tag', async () => {
    const result = await api.productTags.updateTag(tagId, { position: 2 });
    expect(result.position).toBe(2);
  });

  test('delete tag', async () => {
    const result = await api.productTags.deleteTag(tagId);
    expect(result.status).toEqual('success');
  });
});
