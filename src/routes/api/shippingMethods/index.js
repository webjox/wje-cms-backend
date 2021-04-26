import Router from 'koa-router';
import utils from '../../../libs/utils';
import api from '../../../services/api';
import security from '../../../libs/security';

const shippingMethodsRouter = new Router({ prefix: '/v1/shipping_methods' });

shippingMethodsRouter.get(
  '/',
  security.checkUserScope.bind(this, security.scope.READ_SHIPPING_METHODS),
  async ctx => {
    ctx.body = await api.shippingMethods.getMethods();
  },
);

shippingMethodsRouter.post(
  '/',
  security.checkUserScope.bind(this, security.scope.WRITE_SHIPPING_METHODS),
  async ctx => {
    ctx.body = await api.shippingMethods.createMethod(ctx.request.body);
  },
);

shippingMethodsRouter.get(
  '/:id',
  security.checkUserScope.bind(this, security.scope.READ_SHIPPING_METHODS),
  async ctx => {
    ctx.body = await api.shippingMethods.getMethodById(utils.getIdByUrl(ctx.url, 1));
  },
);

shippingMethodsRouter.put(
  '/:id',
  security.checkUserScope.bind(this, security.scope.WRITE_SHIPPING_METHODS),
  async ctx => {
    ctx.body = await api.shippingMethods.updateMethod(
      utils.getIdByUrl(ctx.url, 1),
      ctx.request.body,
    );
  },
);

shippingMethodsRouter.delete(
  '/:id',
  security.checkUserScope.bind(this, security.scope.WRITE_SHIPPING_METHODS),
  async ctx => {
    ctx.body = await api.shippingMethods.deleteMethod(utils.getIdByUrl(ctx.url, 1));
  },
);

export default shippingMethodsRouter;
