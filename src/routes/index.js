import Router from 'koa-router';
import apiRouter from './api';
import ajaxRouter from './ajax';

const router = new Router();

router
  .use(apiRouter.routes())
  .use(apiRouter.allowedMethods())
  .use(ajaxRouter.routes())
  .use(ajaxRouter.allowedMethods());

export default router;
