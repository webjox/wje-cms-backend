import Router from 'koa-router';
import utils from '../../../libs/utils';
import paymentGatewaysApi from '../../../services/settings/paymentGateways';
import security from '../../../libs/security';

const paymentGatewaysRouter = new Router({prefix: '/v1/payment_gateways'});

paymentGatewaysRouter.get('/:name', 
    security.checkUserScope.bind(this, security.scope.READ_PAYMENT_METHODS),
    async ctx => {
    ctx.body = await paymentGatewaysApi.getGateway(utils.getIdByUrl(ctx.url, 1));
})

paymentGatewaysRouter.put('/:name', 
    security.checkUserScope.bind(this, security.scope.WRITE_PAYMENT_METHODS),
    async ctx => {
    ctx.body = await paymentGatewaysApi.updateGateway(utils.getIdByUrl(ctx.url, 1), ctx.request.body);
})

export default paymentGatewaysRouter;