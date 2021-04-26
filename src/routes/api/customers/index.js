import Router from 'koa-router';
import customerApi from '../../../services/customers';
import utils from '../../../libs/utils';
import security from '../../../libs/security';

const customerRouter = new Router({ prefix: '/v1/customers' });

customerRouter.get(
  '/',
  security.checkUserScope.bind(this, security.scope.READ_CUSTOMERS),
  async ctx => {
    ctx.body = await customerApi.getCustomers();
  },
);

customerRouter.post(
  '/',
  security.checkUserScope.bind(this, security.scope.WRITE_CUSTOMERS),
  async ctx => {
    ctx.body = await customerApi.addCustomer(ctx.request.body);
  },
);

customerRouter.get(
  '/:id',
  security.checkUserScope.bind(this, security.scope.READ_CUSTOMERS),
  async ctx => {
    ctx.body = await customerApi.getSingleCustomer(utils.getIdByUrl(ctx.url, 1));
  },
);

customerRouter.put(
  '/:id',
  security.checkUserScope.bind(this, security.scope.WRITE_CUSTOMERS),
  async ctx => {
    ctx.body = await customerApi.updateCustomer(utils.getIdByUrl(ctx.url, 1), ctx.request.body);
  },
);

customerRouter.delete(
  '/:id',
  security.checkUserScope.bind(this, security.scope.WRITE_CUSTOMERS),
  async ctx => {
    ctx.body = await customerApi.deleteCustomer(utils.getIdByUrl(ctx.url, 1));
  },
);

export default customerRouter;
