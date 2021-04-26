import Router from 'koa-router';
import utils from '../../../libs/utils';
import redirectsApi from '../../../services/redirects';
import security from '../../../libs/security';

const redirectsRouter = new Router({ prefix: '/v1/redirects' });

redirectsRouter.get(
  '/',
  security.checkUserScope.bind(this, security.scope.READ_SETTINGS),
  async ctx => {
    ctx.body = await redirectsApi.getRedirects();
  },
);

redirectsRouter.post(
  '/',
  security.checkUserScope.bind(this, security.scope.WRITE_SETTINGS),
  async ctx => {
    ctx.body = await redirectsApi.addRedirect(ctx.request.body);
  },
);

redirectsRouter.get(
  '/:id',
  security.checkUserScope.bind(this, security.scope.READ_SETTINGS),
  async ctx => {
    ctx.body = await redirectsApi.getSingleRedirect(utils.getIdByUrl(ctx.url, 1));
  },
);

redirectsRouter.put(
  '/:id',
  security.checkUserScope.bind(this, security.scope.WRITE_SETTINGS),
  async ctx => {
    ctx.body = await redirectsApi.updateRedirect(utils.getIdByUrl(ctx.url, 1), ctx.request.body);
  },
);

redirectsRouter.delete(
  '/:id',
  security.checkUserScope.bind(this, security.scope.WRITE_SETTINGS),
  async ctx => {
    ctx.body = await redirectsApi.deleteRedirect(utils.getIdByUrl(ctx.url, 1));
  },
);

export default redirectsRouter;
