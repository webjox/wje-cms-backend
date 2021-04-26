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

describe('customer groups api', () => {
  beforeAll(async () => {
    const url = `mongodb://127.0.0.1:27017/webjox-cms-jest-customer-groups`;
    const connection = await mongoose.createConnection(url, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    await connection.dropDatabase();
    await mongoose.connect(url, { useNewUrlParser: true, useFindAndModify: false });
  });

  let groupId;
  const defaultData = {
    name: 'default name',
  };

  test('add new group', async () => {
    const result = await api.customerGroups.addGroup(defaultData);
    groupId = result._id;
    expect(result.name).toEqual(defaultData.name);
  });

  test('get group by id', async () => {
    const result = await api.customerGroups.getSingleGroup(groupId);
    expect(result._id).toEqual(groupId);
  });

  test('get groups', async () => {
    const result = await api.customerGroups.getGroups();
    expect(result[0]._id).toEqual(groupId);
  });

  test('update group', async () => {
    const result = await api.customerGroups.updateGroup(groupId, { name: 'alfa group' });
    expect(result.name).toEqual('alfa group');
  });

  test('delete group', async () => {
    await api.customerGroups.deleteGroup(groupId);
    const result = await api.customerGroups.getGroups();
    expect(result.length).toBe(0);
  });
});
