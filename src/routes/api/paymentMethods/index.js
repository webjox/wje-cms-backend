import Router from 'koa-router';
import utils from '../../../libs/utils';
import paymentMethodsApi from '../../../services/orders/paymentMethods';
import security from '../../../libs/security';

const paymentMethodsRouter = new Router({prefix: '/v1/payment_methods'});

paymentMethodsRouter.get('/', 
    security.checkUserScope.bind(this, security.scope.READ_PAYMENT_METHODS),
    async ctx => {
    ctx.body = await paymentMethodsApi.getMethods()
})

paymentMethodsRouter.post('/',
    security.checkUserScope.bind(this, security.scope.WRITE_PAYMENT_METHODS),
    async ctx => {
    ctx.body = await paymentMethodsApi.addMethod(ctx.request.body)
})

paymentMethodsRouter.get('/:id',
    security.checkUserScope.bind(this, security.scope.READ_PAYMENT_METHODS),
    async ctx => {
    ctx.body = await paymentMethodsApi.getSingleMethod(utils.getIdByUrl(ctx.url, 1));
})

paymentMethodsRouter.put('/:id', 
    security.checkUserScope.bind(this, security.scope.WRITE_PAYMENT_METHODS),
    async ctx => {
    ctx.body = await paymentMethodsApi.updateMethod(utils.getIdByUrl(ctx.url, 1), ctx.request.body);
})

paymentMethodsRouter.delete('/:id', 
    security.checkUserScope.bind(this, security.scope.WRITE_PAYMENT_METHODS),
    async ctx => {
    ctx.body = await paymentMethodsApi.deleteMethod(utils.getIdByUrl(ctx.url, 1));
})

export default paymentMethodsRouter;