import Router from 'koa-router';
import SecurityTokensApi from '../../../services/security/tokens';
import utils from '../../../libs/utils';
import security from '../../../libs/security';

const securityTokensRouter = new Router({ prefix: '/v1/security/tokens' });

securityTokensRouter.get(
  '/',
  security.checkUserScope.bind(this, security.scope.ADMIN),
  async ctx => {
    ctx.body = await SecurityTokensApi.getTokens();
  },
);

securityTokensRouter.get(
  '/blacklist',
  security.checkUserScope.bind(this, security.scope.ADMIN),
  async ctx => {
    ctx.body = await SecurityTokensApi.getTokensBlacklist();
  },
);

securityTokensRouter.post(
  '/',
  security.checkUserScope.bind(this, security.scope.ADMIN),
  async ctx => {
    ctx.body = await SecurityTokensApi.addToken(ctx.request.body);
  },
);

securityTokensRouter.get(
  '/:id',
  security.checkUserScope.bind(this, security.scope.ADMIN),
  async ctx => {
    ctx.body = await SecurityTokensApi.getSingleToken(utils.getIdByUrl(ctx.url, 1));
  },
);

securityTokensRouter.put(
  '/:id',
  security.checkUserScope.bind(this, security.scope.ADMIN),
  async ctx => {
    ctx.body = await SecurityTokensApi.updateToken(utils.getIdByUrl(ctx.url, 1), ctx.request.body);
  },
);

securityTokensRouter.delete(
  '/:id',
  security.checkUserScope.bind(this, security.scope.ADMIN),
  async ctx => {
    ctx.body = await SecurityTokensApi.deleteToken(utils.getIdByUrl(ctx.url, 1));
  },
);

securityTokensRouter.post(
  '/authorize',
  security.checkUserScope.bind(this, security.scope.ADMIN),
  async ctx => {
    ctx.body = await SecurityTokensApi.sendDashboardSigninUrl(ctx.request);
  },
);

export default securityTokensRouter;
