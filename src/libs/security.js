import jwt from 'jsonwebtoken';
import koaJwt from 'koa-jwt';
import config from '../../config';
import SecurityTokensApi from '../services/security/tokens';
import authHeader from './auth-header';
import customersApi from '../services/customers';

const DEVELOPER_MODE = config.developerMode === true;
const SET_TOKEN_AS_REVOKEN_ON_EXCEPTION = true;

const PATHS_WITH_OPEN_ACCESS = [
    '/api/v1/authorize',
    /\/api\/v1\/notifications/i,
	/\/ajax\//i
];

const scope = {
	ADMIN: 'admin',
	DASHBOARD: 'dashboard',
	READ_PRODUCTS: 'read:products',
	WRITE_PRODUCTS: 'write:products',
	READ_PRODUCT_CATEGORIES: 'read:product_categories',
	WRITE_PRODUCT_CATEGORIES: 'write:product_categories',
	READ_ORDERS: 'read:orders',
	WRITE_ORDERS: 'write:orders',
	READ_CUSTOMERS: 'read:customers',
	WRITE_CUSTOMERS: 'write:customers',
	READ_CUSTOMER_GROUPS: 'read:customer_groups',
	WRITE_CUSTOMER_GROUPS: 'write:customer_groups',
	READ_PAGES: 'read:pages',
	WRITE_PAGES: 'write:pages',
	READ_ORDER_STATUSES: 'read:order_statuses',
	WRITE_ORDER_STATUSES: 'write:order_statuses',
	READ_THEME: 'read:theme',
	WRITE_THEME: 'write:theme',
	READ_SITEMAP: 'read:sitemap',
	READ_SHIPPING_METHODS: 'read:shipping_methods',
	WRITE_SHIPPING_METHODS: 'write:shipping_methods',
	READ_PAYMENT_METHODS: 'read:payment_methods',
	WRITE_PAYMENT_METHODS: 'write:payment_methods',
	READ_SETTINGS: 'read:settings',
	WRITE_SETTINGS: 'write:settings',
	READ_FILES: 'read:files',
	WRITE_FILES: 'write:files',
	READ_TAGS: 'read:tags',
	WRITE_TAGS: 'write:tags',
	READ_SHOPS: 'read:shops',
	WRITE_SHOPS: 'write:shops'
};

const checkUserScope = async (requiredScope, ctx, next) => {
	// get ctx, get token, encode token
	// get email from token, find email in db.tokens, check expiration.
	// if token is avialable, next(), else 403 and go to login
	let token, user;
	if(ctx.headers.user) {
	 token = ctx.headers.user;
	user = authHeader.decodeUserLoginAuth(token);
	} else {
	 token = ctx.request.body;
	 const userId = authHeader.decodeUserLoginAuth(token);
	 user = await customersApi.getSingleCustomer(userId);
	}
	if (DEVELOPER_MODE === true) {
		await next();
	} else if (
		user &&
		user.scopes &&
		user.scopes.length > 0 &&
		(user.scopes.includes(scope.ADMIN) ||
			user.scopes.includes(requiredScope))
	) {
		next();
	} else {
        ctx.status = 403;
        ctx.body = {error: true, message: 'Forbidden'};
	}
};

const verifyToken = token => {
    try {
        const decodedToken = jwt.verify(token, config.jwtSecretKey);
        if(decodedToken) return decodedToken;
    } catch (error) {
        console.log(`${error}`.red)
    }
};

const checkTokenInBlacklistCallback = async (payload, done) => {
    try {
        const jti = payload.jti;
        const blacklist = await SecurityTokensApi.getTokensBlacklist();
        const tokenIsRevoked = blacklist.includes(jti);
        return done(null, tokenIsRevoked);
    } catch (error) {
        done(e, SET_TOKEN_AS_REVOKEN_ON_EXCEPTION)
    }
};

const applyMiddleware = app => {
    if(DEVELOPER_MODE === false) {
        app.use(
            koaJwt({
                secret: config.jwtSecretKey,
                isRevoked: checkTokenInBlacklistCallback
            }).unless({ path: PATHS_WITH_OPEN_ACCESS })
        );
    }
}

const getAccessControlAllowOrigin = () => {
    return config.storeBaseUrl || '*';
}

export default {
    checkUserScope: checkUserScope,
    scope: scope,
    verifyToken: verifyToken,
    applyMiddleware: applyMiddleware,
    getAccessControlAllowOrigin: getAccessControlAllowOrigin,
    DEVELOPER_MODE: DEVELOPER_MODE
}