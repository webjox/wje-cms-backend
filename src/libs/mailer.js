import winston from 'winston';
import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import config from '../../config';
import emailSettingsApi from '../services/settings/email';

const SMTP_FROM_CONFIG_FILE = {
  host: config.smtpServer.host,
  port: config.smtpServer.port,
  secure: config.smtpServer.secure,
  auth: {
    user: config.smtpServer.user,
    pass: config.smtpServer.pass,
  },
};

const getSmtpFromEmailSettings = emailSettings => {
  return {
    host: emailSettings.smtpServer.host,
    port: emailSettings.smtpServer.port,
    secure: emailSettings.smtpServer.port === 465,
    auth: {
      user: emailSettings.smtpServer.user,
      pass: emailSettings.smtpServer.pass,
    },
  };
};

const getSmtp = emailSettings => {
  const useSmtpServerFromConfigFile = emailSettings ? emailSettings.host : false;
  const smtp = useSmtpServerFromConfigFile
    ? getSmtpFromEmailSettings(emailSettings)
    : SMTP_FROM_CONFIG_FILE;
  return smtp;
};

const sendEmail = async (smtp, message) => {
  if (!message.to.includes('@')) {
    return 'Invalid email address';
  }

  const transporter = nodemailer.createTransport(smtpTransport(smtp));
  return await transporter.sendMail(message);
};

const getFrom = emailSettings => {
  const useSmtpServerFromConfigFile = emailSettings ? emailSettings.host : false;
  return useSmtpServerFromConfigFile
    ? `"${emailSettings.from_name}" <${emailSettings.from_address}>`
    : `"${config.smtpServer.fromName}" <${config.smtpServer.fromAddress}>`;
};

const send = async message => {
  const emailSettings = await emailSettingsApi.getEmailSettings();
  const smtp = getSmtp(emailSettings);
  message.from = getFrom(emailSettings);
  try {
    const result = await sendEmail(smtp, message);
    winston.info(`Email sent: `, result);
    return true;
  } catch (error) {
    winston.error(`Email send failed: `, error);
    return false;
  }
};

export default {
  send,
};
