import Router from 'koa-router';
import PaymentGateways from '../../../paymentGateways';
import utils from '../../../libs/utils';

const notificationsRouter = new Router({ prefix: '/v1/notifications' });

notificationsRouter.post('/:gateway', async ctx => {
  ctx.body = await PaymentGateways.paymentNotification(ctx, utils.getIdByUrl(ctx.url, 1));
});

export default notificationsRouter;
