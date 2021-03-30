import models from '../models';
import url from 'url';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import uaParser from 'ua-parser-js';
import handlebars from 'handlebars';
import lruCache from 'lru-cache';
import config from '../../../config';
import mailer from '../../libs/mailer';
import settingsApi from '../settings/settings';
import parse from '../../libs/parse';
import { Types } from 'mongoose';
import logger from 'winston';

const tokenModel = models.tokenModel;

const cache = new lruCache({
    max: 10000,
    maxAge: 1000 * 60 * 60 * 24 // 24h
})

const BLACKLIST_CACHE_KEY = 'blacklist';

class SecurityTokensApi {
    constructor () {}

    async getTokens(params = {}) {
        const filter = {
            is_revoked: false
        };
        const _id = Types.ObjectId.isValid(params._id) ? params._id : null;

        if(_id) {
            filter._id = _id
        }
        const email = parse.getString(params.email).toLowerCase();
        if(email && email.length > 0) {
            filter.email = email
        }
        return await tokenModel.find(filter);
    }

    async getTokensBlacklist() {
        const blacklistFromCache = cache.get(BLACKLIST_CACHE_KEY);
        if(blacklistFromCache) {
            return blacklistFromCache;
        } else {
            const items = await tokenModel.find({ is_revoked: true }, { _id: 1 });
            const blackListFromDB = items.map(item => item._id);
            cache.set(BLACKLIST_CACHE_KEY, blackListFromDB);
            return blackListFromDB;
        }
    }

    async getSingleToken (id) {
        if(!Types.ObjectId.isValid(id)) {
            return 'Invalid identifier'
        }

        return await tokenModel.findById(id);
    }

    
    async getSingleTokenByEmail(email) {
        const tokens = await this.getTokens({email});
        return tokens[0];
    }

    async addToken(data) {
        try {
            const token = await tokenModel.create(data);
            const signedToken = await this.getSignedToken(token);
            token.token = signedToken;
            return token;   
        } catch (error) {
            console.lore(`${error}`.red);
        }
    }

    async updateToken(id, data) {
        if(!Types.ObjectId.isValid(id)) {
            return 'Invalid identifier'
        }
        try {
            return await tokenModel.findByIdAndUpdate(id, data);   
        } catch (error) {
            logger.error(error.toString());
        }
    } 

    async deleteToken(id) {
        if(!Types.ObjectId.isValid(id)) {
            return 'Invalid identifier'
        }

        try {
            await this.updateToken(id, {
                is_revoked: true
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
        if(token) {
            const signedToken = await this.getSignedToken(token);
            const loginUrl = new URL(`${config.adminLoginUrl}`, `${settings.domain}`);
            return `${loginUrl.href}?token=${signedToken}`;
        } else return null;
    }
    
    getIp (req) {
        const ip = req.get(`x-forwarded-for`) || req.ip;

        if (ip && ip.includes(', ')) {
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
		const email = req.body.email;
		const userAgent = uaParser(req.get('user-agent'));
		const country = req.get('cf-ipcountry') || '';
		const ip = this.getIP(req);
		const date = moment(new Date()).format('dddd, MMMM DD, YYYY h:mm A');
        const link = await this.getDashboardSigninUrl(email);

		if (link) {
			const linkObj = url.parse(link);
			const domain = `${linkObj.protocol}//${linkObj.host}`;
			const device = userAgent.device.vendor
				? userAgent.device.vendor + ' ' + userAgent.device.model + ', '
				: '';
			const requestFrom = `${device}${userAgent.os.name}, ${
				userAgent.browser.name
			}<br />
      ${date}<br />
      IP: ${ip}<br />
      ${country}`;

			const message = {
				to: email,
				subject: this.getTextFromHandlebars(this.getSigninMailSubject(), {
					from: userAgent.os.name
				}),
				html: this.getTextFromHandlebars(this.getSigninMailBody(), {
					link,
					email,
					domain,
					requestFrom
				})
			};

			const emailSent = await mailer.send(message);
			return { sent: emailSent, error: null };
		} else {
			return { sent: false, error: 'Access Denied' };
		}
	}  
    
	getIP(req) {
		let ip = req.get('x-forwarded-for') || req.ip;

		if (ip && ip.includes(', ')) {
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
            jti: token._id
        }

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
            const countOfTokens = await tokenModel.countDocuments({ email: email, is_revoked: false});
            return countOfTokens === 0 ? email : new Error(`Token must be unique`);
        } else return email;
    }

}

export default new SecurityTokensApi();