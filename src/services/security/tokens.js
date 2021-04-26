import url from 'url';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import uaParser from 'ua-parser-js';
import handlebars from 'handlebars';
import LruCache from 'lru-cache';
import { Types } from 'mongoose';
import logger from 'winston';
import config from '../../../config';
import mailer from '../../libs/mailer';
import settingsApi from '../settings/settings';
import parse from '../../libs/parse';
import models from '../models';

const { TokenModel } = models;

const cache = new LruCache({
  max: 10000,
  maxAge: 1000 * 60 * 60 * 24, // 24h
});

const BLACKLIST_CACHE_KEY = 'blacklist';

class SecurityTokensApi {
  async getTokens(params = {}) {
    const filter = {
      is_revoked: false,
    };
    const _id = Types.ObjectId.isValid(params._id) ? params._id : null;

    if (_id) {
      filter._id = _id;
    }
    const email = parse.getString(params.email).toLowerCase();
    if (email && email.length > 0) {
      filter.email = email;
    }
    const result = await TokenModel.find(filter);
    return result;
  }

  async getTokensBlacklist() {
    const blacklistFromCache = cache.get(BLACKLIST_CACHE_KEY);
    if (blacklistFromCache) {
      return blacklistFromCache;
    }
    const items = await TokenModel.find({ is_revoked: true }, { _id: 1 });
    const blackListFromDB = items.map(item => item._id);
    cache.set(BLACKLIST_CACHE_KEY, blackListFromDB);
    return blackListFromDB;
  }

  async getSingleToken(id) {
    if (!Types.ObjectId.isValid(id)) {
      return 'Invalid identifier';
    }

    const result = await TokenModel.findById(id);
    return result;
  }

  async getSingleTokenByEmail(email) {
    const tokens = await this.getTokens({ email });
    return tokens[0];
  }

  async addToken(data) {
    try {
      const token = await TokenModel.create(data);
      const signedToken = await this.getSignedToken(token);
      token.token = signedToken;
      return token;
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async updateToken(id, data) {
    if (!Types.ObjectId.isValid(id)) {
      return 'Invalid identifier';
    }
    try {
      return await TokenModel.findByIdAndUpdate(id, data);
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async deleteToken(id) {
    if (!Types.ObjectId.isValid(id)) {
      return 'Invalid identifier';
    }

    try {
      await this.updateToken(id, {
        is_revoked: true,
      });
      cache.del(BLACKLIST_CACHE_KEY);
      return true;
    } catch (error) {
      logger.error(error.toString());
      return false;
    }
  }

  async getDashboardSigninUrl(email) {
    const settings = await settingsApi.getSettings();
    const token = await this.getSingleTokenByEmail(email);
    if (token) {
      const signedToken = await this.getSignedToken(token);
      const loginUrl = new URL(`${config.adminLoginUrl}`, `${settings.domain}`);
      return `${loginUrl.href}?token=${signedToken}`;
    }
    return null;
  }

  getIp(req) {
    let ip = req.get(`x-forwarded-for`) || req.ip;

    if (ip && ip.includes(', ')) {
      // eslint-disable-next-line prefer-destructuring
      ip = ip.split(', ')[0];
    }

    if (ip && ip.includes('::ffff:')) {
      ip = ip.replace('::ffff:', '');
    }

    if (ip === '::1') {
      ip = 'localhost';
    }

    return ip;
  }

  getTextFromHandlebars(text, context) {
    const template = handlebars.compile(text, { noEscape: true });
    return template(context);
  }

  getSigninMailSubject() {
    return 'New sign-in from {{from}}';
  }

  getSigninMailBody() {
    return `<div style="color: #202020; line-height: 1.5;">
      Your email address {{email}} was just used to request<br />a sign in email to {{domain}} dashboard.
      <div style="padding: 60px 0px;"><a href="{{link}}" style="background-color: #3f51b5; color: #ffffff; padding: 12px 26px; font-size: 18px; border-radius: 28px; text-decoration: none;">Click here to sign in</a></div>
      <b>Request from</b>
      <div style="color: #727272; padding: 0 0 20px 0;">{{requestFrom}}</div>
      If this was not you, you can safely ignore this email.<br /><br />
      Best,<br />
      Cezerin Robot`;
  }

  async sendDashboardSigninUrl(req) {
    const { email } = req.body;
    const userAgent = uaParser(req.get('user-agent'));
    const country = req.get('cf-ipcountry') || '';
    const ip = this.getIP(req);
    const date = moment(new Date()).format('dddd, MMMM DD, YYYY h:mm A');
    const link = await this.getDashboardSigninUrl(email);

    if (link) {
      const linkObj = url.parse(link);
      const domain = `${linkObj.protocol}//${linkObj.host}`;
      const device = userAgent.device.vendor
        ? `${userAgent.device.vendor} ${userAgent.device.model}, `
        : '';
      const requestFrom = `${device}${userAgent.os.name}, ${userAgent.browser.name}<br />
      ${date}<br />
      IP: ${ip}<br />
      ${country}`;

      const message = {
        to: email,
        subject: this.getTextFromHandlebars(this.getSigninMailSubject(), {
          from: userAgent.os.name,
        }),
        html: this.getTextFromHandlebars(this.getSigninMailBody(), {
          link,
          email,
          domain,
          requestFrom,
        }),
      };

      const emailSent = await mailer.send(message);
      return { sent: emailSent, error: null };
    }
    return { sent: false, error: 'Access Denied' };
  }

  getIP(req) {
    let ip = req.get('x-forwarded-for') || req.ip;

    if (ip && ip.includes(', ')) {
      // eslint-disable-next-line prefer-destructuring
      ip = ip.split(', ')[0];
    }

    if (ip && ip.includes('::ffff:')) {
      ip = ip.replace('::ffff:', '');
    }

    if (ip === '::1') {
      ip = 'localhost';
    }

    return ip;
  }

  async getSignedToken(token) {
    const jwtOptions = {};

    const payload = {
      scopes: token.scopes,
      jti: token._id,
    };

    if (token.email && token.email.length > 0) {
      payload.email = token.email.toLowerCase();
    }

    if (token.expiration) {
      // convert hour to sec
      jwtOptions.expiresIn = token.expiration * 60 * 60;
    }

    try {
      const signed = await jwt.sign(payload, config.jwtSecretKey, jwtOptions);
      return signed;
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async checkTokenEmailUnique(email) {
    if (email && email.length > 0) {
      const countOfTokens = await TokenModel.countDocuments({ email, is_revoked: false });
      return countOfTokens === 0 ? email : new Error(`Token must be unique`);
    }
    return email;
  }
}

export default new SecurityTokensApi();
