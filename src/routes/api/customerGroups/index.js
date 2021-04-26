import Router from 'koa-router';
import customerGroupsApi from '../../../services/customers/customerGroups';
import utils from '../../../libs/utils';
import security from '../../../libs/security';

const customerGroupsRouter = new Router({ prefix: '/v1/customer_groups' });

customerGroupsRouter.get(
  '/',
  security.checkUserScope.bind(this, security.scope.READ_CUSTOMER_GROUPS),
  async ctx => {
    ctx.body = await customerGroupsApi.getGroups();
  },
);

customerGroupsRouter.post(
  '/',
  security.checkUserScope.bind(this, security.scope.WRITE_CUSTOMER_GROUPS),
  async ctx => {
    ctx.body = await customerGroupsApi.addGroup(ctx.request.body);
  },
);

customerGroupsRouter.get(
  '/:id',
  security.checkUserScope.bind(this, security.scope.READ_CUSTOMER_GROUPS),
  async ctx => {
    ctx.body = await customerGroupsApi.getSingleGroup(utils.getIdByUrl(ctx.url, 1));
  },
);

customerGroupsRouter.put(
  '/:id',
  security.checkUserScope.bind(this, security.scope.WRITE_CUSTOMER_GROUPS),
  async ctx => {
    ctx.body = await customerGroupsApi.updateGroup(utils.getIdByUrl(ctx.url, 1), ctx.request.body);
  },
);

customerGroupsRouter.delete(
  '/:id',
  security.checkUserScope.bind(this, security.scope.WRITE_CUSTOMER_GROUPS),
  async ctx => {
    ctx.body = await customerGroupsApi.deleteGroup(utils.getIdByUrl(ctx.url, 1));
  },
);

export default customerGroupsRouter;
