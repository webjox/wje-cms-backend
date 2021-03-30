import Router from 'koa-router';
import security from '../../../libs/security';
import utils from '../../../libs/utils';
import api from '../../../services/api';

const ShopRouter = new Router({prefix: "/v1/shops"})
const shops = api.shops;
const getIdByUrl = utils.getIdByUrl;

ShopRouter.get('/',
    security.checkUserScope.bind(this, security.scope.READ_SHOPS),
    async ctx => {
    const result = await shops.getShops();
    ctx.body = result;
})

ShopRouter.get('/:id', 
    security.checkUserScope.bind(this, security.scope.READ_SHOPS),
    async ctx => {
    const result = await shops.getShopById(getIdByUrl(ctx.url, 1));
    ctx.body = result;
})

ShopRouter.post('/',
    security.checkUserScope.bind(this, security.scope.WRITE_SHOPS),
    async ctx => {
    const result = await shops.addShop(ctx.request.body);
    ctx.body = result;
})

ShopRouter.put('/:id',
    security.checkUserScope.bind(this, security.scope.WRITE_SHOPS),
    async ctx => {
    const result = await shops.updateShop(getIdByUrl(ctx.url, 1), ctx.request.body);
    ctx.body = result;
})

ShopRouter.delete('/:id',
    security.checkUserScope.bind(this, security.scope.WRITE_SHOPS),
    async ctx => {
    const result = await shops.deleteShop(getIdByUrl(ctx.url, 1));
    ctx.body = result;
})

export default ShopRouter;