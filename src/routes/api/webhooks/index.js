import Router from 'koa-router';
import webhooksApi from '../../../services/webhooks';
import utils from '../../../libs/utils';
import security from '../../../libs/security';

const webhooksRouter = new Router({ prefix: '/v1/webhooks' });

webhooksRouter.get(
  '/',
  security.checkUserScope.bind(this, security.scope.READ_SETTINGS),
  async ctx => {
    ctx.body = await webhooksApi.getWebhooks();
  },
);

webhooksRouter.post(
  '/',
  security.checkUserScope.bind(this, security.scope.WRITE_SETTINGS),
  async ctx => {
    ctx.body = await webhooksApi.addWebhook(ctx.request.body);
  },
);

webhooksRouter.get(
  '/:id',
  security.checkUserScope.bind(this, security.scope.READ_SETTINGS),
  async ctx => {
    ctx.body = await webhooksApi.getSingleWebhooks(utils.getIdByUrl(ctx.url, 1));
  },
);

webhooksRouter.put(
  '/:id',
  security.checkUserScope.bind(this, security.scope.WRITE_SETTINGS),
  async ctx => {
    ctx.body = await webhooksApi.updateWebhook(utils.getIdByUrl(ctx.url, 1), ctx.request.body);
  },
);

webhooksRouter.delete(
  '/:id',
  security.checkUserScope.bind(this, security.scope.WRITE_SETTINGS),
  async ctx => {
    ctx.body = await webhooksApi.deleteWebhook(utils.getIdByUrl(ctx.url, 1));
  },
);

export default webhooksRouter;
