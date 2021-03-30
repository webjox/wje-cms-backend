import Koa from 'koa';
import helmet from 'koa-helmet';
import koaBody from 'koa-body';
import router from './routes';
import logger from './libs/logger';
import cors from 'koa-cors';
import mongoose from 'mongoose';
import config from '../config';
import serve from 'koa-static';

mongoose.connect(config.mongoDbUrl, {useNewUrlParser: true, useFindAndModify: false}, (err) => {
  if(err) console.log(err);
  else console.log('Succesfull Connected to database'.green);
})

const corsOptions = {
  methods: 'GET,PUT,POST,DELETE,OPTIONS',
  origin: config.storeBaseUrl,
  credentials: true
}

const app = new Koa();

app.proxy = true;
app.silent = false;

app.use(helmet());
app.use(cors(corsOptions));
app.use(koaBody());
app.use(serve('public/content'));
app
  .use(router.routes())
  .use(router.allowedMethods())
  
app.use(logger.sendResponse);


app.on('error', (err, ctx) => {
    if (err.logged || ctx.status >= 500) {
      console.log({
        err,
        req: ctx.request,
        res: ctx.response,
      });
    }
});

export default app;
