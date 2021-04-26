import Koa from 'koa';
import helmet from 'koa-helmet';
import koaBody from 'koa-body';
import cors from 'koa-cors';
import mongoose from 'mongoose';
import serve from 'koa-static';
import winston from 'winston';
import router from './routes';
import logger from './libs/logger';
import config from '../config';

mongoose.connect(config.mongoDbUrl, { useNewUrlParser: true, useFindAndModify: false }, err => {
  if (err) winston.error(err.toString());
  else winston.info('Succesfull Connected to database');
});

const corsOptions = {
  methods: 'GET,PUT,POST,DELETE,OPTIONS',
  origin: config.storeBaseUrl,
  credentials: true,
};

const app = new Koa();

app.proxy = true;
app.silent = false;

app.use(helmet());
app.use(cors(corsOptions));
app.use(koaBody());
app.use(serve('public/content'));
app.use(router.routes()).use(router.allowedMethods());

app.use(logger.sendResponse);

app.on('error', (err, ctx) => {
  if (err.logged || ctx.status >= 500) {
    winston.error(
      {
        err,
        req: ctx.request,
        res: ctx.response,
      }.toString(),
    );
  }
});

export default app;
