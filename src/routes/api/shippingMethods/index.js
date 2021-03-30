import Router from 'koa-router';
import utils from '../../../libs/utils';
import shippingMethodsApi from '../../../services/orders/shippingMethods';
import security from '../../../libs/security';

const shippingMethodsRouter = new Router({prefix: '/v1/shipping_methods'});

shippingMethodsRouter.get('/',
    security.checkUserScope.bind(this, security.scope.READ_SHIPPING_METHODS),
    async ctx => {
    ctx.body = await shippingMethodsApi.getMethods();
})

shippingMethodsRouter.post('/', 
    security.checkUserScope.bind(this, security.scope.WRITE_SHIPPING_METHODS),
    async ctx => {
    ctx.body = await shippingMethodsApi.addMethod(ctx.request.body);
})

shippingMethodsRouter.get('/:id', 
    security.checkUserScope.bind(this, security.scope.READ_SHIPPING_METHODS),
    async ctx => {
    ctx.body = await shippingMethodsApi.getSingleMethod(utils.getIdByUrl(ctx.url, 1));
})

shippingMethodsRouter.put('/:id', 
    security.checkUserScope.bind(this, security.scope.WRITE_SHIPPING_METHODS),
    async ctx => {
    ctx.body = await shippingMethodsApi.updateMethod(utils.getIdByUrl(ctx.url, 1), ctx.request.body);
})

shippingMethodsRouter.delete('/:id', 
    security.checkUserScope.bind(this, security.scope.WRITE_SHIPPING_METHODS),
    async ctx => {
    ctx.body = await shippingMethodsApi.deleteMethod(utils.getIdByUrl(ctx.url, 1));
})



export default shippingMethodsRouter;