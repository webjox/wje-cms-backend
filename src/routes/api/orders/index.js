import Router from 'koa-router';
import ordersApi from '../../../services/orders';
import ordersAddressesApi from '../../../services/orders/orderAddresses';
import ordertDiscountsApi from '../../../services/orders/orderDiscounts';
import orderItemsApi from '../../../services/orders/orderItems';
import orderTransactionsApi from '../../../services/orders/orderTransactions';
import PaymentGateways from '../../../paymentGateways';
import utils from '../../../libs/utils';
import security from '../../../libs/security';

const orderRouter = new Router({ prefix: '/v1/orders' });

orderRouter.get('/', security.checkUserScope.bind(this, security.scope.READ_ORDERS), async ctx => {
  const filter = { ...ctx.request.query };
  ctx.body = await ordersApi.getOrders(filter);
});

orderRouter.post(
  '/',
  security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
  async ctx => {
    ctx.body = await ordersApi.addOrder(ctx.request.body);
  },
);

orderRouter.get(
  '/:id',
  security.checkUserScope.bind(this, security.scope.READ_ORDERS),
  async ctx => {
    ctx.body = await ordersApi.getSingleOrder(utils.getIdByUrl(ctx.url, 1));
  },
);

orderRouter.put(
  '/:id',
  security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
  async ctx => {
    ctx.body = await ordersApi.updateOrder(utils.getIdByUrl(ctx.url, 1), ctx.request.body);
  },
);

orderRouter.delete(
  '/:id',
  security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
  async ctx => {
    ctx.body = await ordersApi.deleteOrder(utils.getIdByUrl(ctx.url, 1));
  },
);

orderRouter.put(
  '/:id/recalculate',
  security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
  async ctx => {
    ctx.body = await orderItemsApi.calculateAndUpdateAllItems(utils.getIdByUrl(ctx.url, 2));
  },
);

orderRouter.put(
  '/:id/checkout',
  security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
  async ctx => {
    ctx.body = await ordersApi.checkoutOrder(utils.getIdByUrl(ctx.url, 2));
  },
);

orderRouter.put(
  '/:id/cancel',
  security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
  async ctx => {
    ctx.body = await ordersApi.cancelOrder(utils.getIdByUrl(ctx.url, 2));
  },
);

orderRouter.put(
  '/:id/close',
  security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
  async ctx => {
    ctx.body = await ordersApi.closeOrder(utils.getIdByUrl(ctx.url, 2));
  },
);

orderRouter.put(
  '/:id/shipping_address',
  security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
  async ctx => {
    ctx.body = await ordersAddressesApi.updateShippingAddress(
      utils.getIdByUrl(ctx.url, 2),
      ctx.request.body,
    );
  },
);

orderRouter.post(
  '/:id/items',
  security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
  async ctx => {
    ctx.body = await orderItemsApi.addItem(utils.getIdByUrl(ctx.url, 2), ctx.request.body);
  },
);

orderRouter.put(
  '/:id/items/:itemid',
  security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
  async ctx => {
    ctx.body = await orderItemsApi.updateItem(
      utils.getIdByUrl(ctx.url, 3),
      utils.getIdByUrl(ctx.url, 1),
      ctx.request.body,
    );
  },
);

orderRouter.delete(
  '/:id/items/:itemid',
  security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
  async ctx => {
    ctx.body = await orderItemsApi.deleteItem(
      utils.getIdByUrl(ctx.url, 3),
      utils.getIdByUrl(ctx.url, 1),
    );
  },
);

orderRouter.post(
  '/:id/transactions',
  security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
  async ctx => {
    ctx.body = await orderTransactionsApi.addTransaction(
      utils.getIdByUrl(ctx.url, 2),
      ctx.request.body,
    );
  },
);

orderRouter.put(
  '/:id/transactions/:transactionId',
  security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
  async ctx => {
    ctx.body = await orderTransactionsApi.updateTransaction(
      utils.getIdByUrl(ctx.url, 3),
      utils.getIdByUrl(ctx.url, 1),
      ctx.request.body,
    );
  },
);

orderRouter.delete(
  '/:id/transactions/:transactionId',
  security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
  async ctx => {
    ctx.body = await orderTransactionsApi.deleteTransaction(
      utils.getIdByUrl(ctx.url, 3),
      utils.getIdByUrl(ctx.url, 1),
    );
  },
);

orderRouter.post(
  '/:id/discounts',
  security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
  async ctx => {
    ctx.body = await ordertDiscountsApi.addDiscount(utils.getIdByUrl(ctx.url, 2), ctx.request.body);
  },
);

orderRouter.put(
  '/:id/discounts/:disccountId',
  security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
  async ctx => {
    ctx.body = await ordertDiscountsApi.updateDiscount(
      utils.getIdByUrl(ctx.url, 3),
      utils.getIdByUrl(ctx.url, 1),
      ctx.request.body,
    );
  },
);

orderRouter.delete(
  '/:id/discounts/:disccountId',
  security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
  async ctx => {
    ctx.body = await ordertDiscountsApi.deleteDiscount(
      utils.getIdByUrl(ctx.url, 3),
      utils.getIdByUrl(ctx.url, 1),
    );
  },
);

orderRouter.get(
  '/:id/payment_form_settings',
  security.checkUserScope.bind(this, security.scope.READ_ORDERS),
  async ctx => {
    ctx.body = await PaymentGateways.getPaymentFormSettings(utils.getIdByUrl(ctx.url, 2));
  },
);

orderRouter.post(
  '/:id/charge',
  security.checkUserScope.bind(this, security.scope.WRITE_ORDERS),
  async ctx => {
    const result = await ordersApi.chargeOrder(utils.getIdByUrl(ctx.url, 2));
    ctx.status = result ? 200 : 500;
  },
);

export default orderRouter;
