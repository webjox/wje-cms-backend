import { hostname } from 'os';
import ow from 'ow';

class Config {
    constructor(env = process.env) {
        this.env = env;
        this.loggerName = `http-server-${hostname}`;
        this.loggerLevel = env.LOGGER_LEVEL || 'info';
        this.httpPort = 8080;
        this.gracefulStopTimeout = 10000;
        this.mongoDbUrl = 'mongodb://127.0.0.1:27017/webjox-cms';
        this.smtpServer = {
            host: 'smtp.yandex.ru',
            port: 465,
            secure: true,
            user: '',
            pass: '',
            fromName: '',
            fromAddress: ''
        };
        this.jwtSecretKey = 'webjox';
        this.cookieSecretKey = 'webjox';
        this.categoriesUploadPath = 'public/content/images/categories';
        this.productsUploadPath = 'public/content/images/products';
        this.filesUploadPath = 'public/content';
        this.categoriesUploadUrl = '/images/categories'
        this.productsUploadUrl = '/images/products';
        this.productsFilesUploadUrl = '/files/products';
        this.productsFilesUploadPath = 'public/content/files/products';
        this.filesUploadUrl = '';
        this.language = 'ru';
        this.orderStartNumber = 1000;
        this.saltRounds = process.env.SALT_ROUNDS || 12;
        this.developerMode = true;
        this.storeBaseUrl = 'http://192.168.74.157:3000';
        this.adminLoginUrl = '/login';
        this.discountsForWholesalerCustomers = [
            30000,
            55000,
            110000,
            350000,
            750000,
            1500000
        ]

        this.validate()
    }
    validate() {
        ow(this.httpPort, ow.number);
        ow(
            this.loggerLevel,
            'env.LOGGER_LEVEL',
            ow.string.oneOf(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),
        );
        ow(this.gracefulStopTimeout, ow.number);
        ow(this.mongoDbUrl, ow.string);
        ow(this.smtpServer, ow.object);
        ow(this.jwtSecretKey, ow.string);
        ow(this.cookieSecretKey, ow.string);
        ow(this.categoriesUploadPath, ow.string);
        ow(this.productsUploadPath, ow.string);
        ow(this.filesUploadPath, ow.string);
        ow(this.productsUploadUrl, ow.string);
        ow(this.categoriesUploadUrl, ow.string);
        ow(this.filesUploadUrl, ow.string);
        ow(this.language, ow.string);
        ow(this.orderStartNumber, ow.number);
        ow(this.saltRounds, ow.number);
        ow(this.developerMode, ow.boolean);
        ow(this.storeBaseUrl, ow.string);
        ow(this.adminLoginUrl, ow.string);
    }
}

export default new Config();