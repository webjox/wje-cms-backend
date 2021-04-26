import Router from 'koa-router';
import orderStatusesApi from '../../../services/orders/orderStatuses';
import utils from '../../../libs/utils';
import security from '../../../libs/security';

const orderStatusesRouter = new Router({ prefix: '/v1/order_statuses' });

orderStatusesRouter.get(
  '/',
  security.checkUserScope.bind(this, security.scope.READ_ORDER_STATUSES),
  async ctx => {
    ctx.body = await orderStatusesApi.getStatuses();
  },
);

orderStatusesRouter.post(
  '/',
  security.checkUserScope.bind(this, security.scope.WRITE_ORDER_STATUSES),
  async ctx => {
    ctx.body = await orderStatusesApi.addStatus(ctx.request.body);
  },
);

orderStatusesRouter.get(
  '/:id',
  security.checkUserScope.bind(this, security.scope.READ_ORDER_STATUSES),
  async ctx => {
    ctx.body = await orderStatusesApi.getSinglesStatuses(utils.getIdByUrl(ctx.url, 1));
  },
);

orderStatusesRouter.put(
  '/:id',
  security.checkUserScope.bind(this, security.scope.WRITE_ORDER_STATUSES),
  async ctx => {
    ctx.body = await orderStatusesApi.updateStatus(utils.getIdByUrl(ctx.url, 1), ctx.request.body);
  },
);

orderStatusesRouter.delete(
  '/:id',
  security.checkUserScope.bind(this, security.scope.WRITE_ORDER_STATUSES),
  async ctx => {
    ctx.body = await orderStatusesApi.deleteStatus(utils.getIdByUrl(ctx.url, 1));
  },
);

export default orderStatusesRouter;
