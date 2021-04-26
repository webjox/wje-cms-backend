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
    const url = `mongodb://127.0.0.1:27017/webjox-cms-jest-settings`;
    const connection = await mongoose.createConnection(url, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    await connection.dropDatabase();
    await mongoose.connect(url, { useNewUrlParser: true, useFindAndModify: false });
  });

  const defaultData = {
    domain: 'http://example.com',
  };

  test('get settings', async () => {
    const result = await api.settings.getSettings();
    expect(result.domain).toEqual(api.settings.defaultSettings.domain);
  });

  test('update settings', async () => {
    const result = await api.settings.updateSettings({ ...defaultData });
    expect(result.domain).toEqual(defaultData.domain);
  });

  const emailTemplateData = {
    name: 'default template',
    link: 'http://localhost.ru/',
  };

  test('add email template', async () => {
    const result = await api.emailTemplates.addEmailTemplate({ ...emailTemplateData });
    expect(result.name).toEqual(emailTemplateData.name);
  });

  test('get email template', async () => {
    const result = await api.emailTemplates.getEmailTemplate(emailTemplateData.name);
    expect(result.name).toEqual(emailTemplateData.name);
  });

  test('update email template', async () => {
    const result = await api.emailTemplates.updateEmailTemplate(emailTemplateData.name, {
      link: 'https://example.com',
    });
    expect(result.link).toEqual('https://example.com');
  });

  test('get email settings', async () => {
    const result = await api.email.getEmailSettings();
    expect(result.pass).toBe(0);
  });

  test('update email settings', async () => {
    const result = await api.email.updateEmailSettings({ host: 'smtp.yandex.ru' });
    expect(result.host).toEqual('smtp.yandex.ru');
  });
});
