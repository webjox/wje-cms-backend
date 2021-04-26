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
    const url = `mongodb://127.0.0.1:27017/webjox-cms-jest-pages`;
    const connection = await mongoose.createConnection(url, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    await connection.dropDatabase();
    await mongoose.connect(url, { useNewUrlParser: true, useFindAndModify: false });
  });

  let pageId;
  const defaultData = {
    meta_title: 'Default title',
    content: '<p>Default content</p>',
    slug: 'test',
  };

  test('add new page', async () => {
    const result = await api.pages.addPage(defaultData);
    pageId = result._id;
    expect(result.meta_title).toEqual(defaultData.meta_title);
  });

  test('get page by id', async () => {
    const result = await api.pages.getSinglePage(pageId);
    expect(result._id).toEqual(pageId);
  });

  test('get pages', async () => {
    const result = await api.pages.getPages();
    expect(result[0]._id).toEqual(pageId);
  });

  test('update page', async () => {
    const result = await api.pages.updatePage(pageId, { content: 'test' });
    expect(result.content).toEqual('test');
  });

  test('delete page', async () => {
    const result = await api.pages.deletePage(pageId);
    expect(result.status).toEqual('success');
  });
});
