import Router from 'koa-router';
import koaBody from 'koa-body';
import security from '../../../libs/security';
import utils from '../../../libs/utils';
import api from '../../../services/api';

const ShopRouter = new Router({ prefix: '/v1/shops' });
const { shops } = api;
const { getIdByUrl } = utils;

ShopRouter.get('/', security.checkUserScope.bind(this, security.scope.READ_SHOPS), async ctx => {
  const result = await shops.getShops();
  ctx.body = result;
});

ShopRouter.get('/:id', security.checkUserScope.bind(this, security.scope.READ_SHOPS), async ctx => {
  const result = await shops.getShopById(getIdByUrl(ctx.url, 1));
  ctx.body = result;
});

ShopRouter.post('/', security.checkUserScope.bind(this, security.scope.WRITE_SHOPS), async ctx => {
  const result = await shops.addShop(ctx.request.body);
  ctx.body = result;
});

ShopRouter.put(
  '/:id',
  security.checkUserScope.bind(this, security.scope.WRITE_SHOPS),
  async ctx => {
    const result = await shops.updateShop(getIdByUrl(ctx.url, 1), ctx.request.body);
    ctx.body = result;
  },
);

ShopRouter.delete(
  '/:id',
  security.checkUserScope.bind(this, security.scope.WRITE_SHOPS),
  async ctx => {
    const result = await shops.deleteShop(getIdByUrl(ctx.url, 1));
    ctx.body = result;
  },
);

ShopRouter.post(
  '/:id/image',
  security.checkUserScope.bind(this, security.scope.WRITE_SHOPS),
  koaBody({
    formidable: {
      uploadDir: './upload',
      keepExtensions: true,
      multiples: true,
    },
    multipart: true,
    urlencoded: true,
    formLimit: '100mb',
  }),
  async ctx => {
    ctx.body = await shops.addImage(utils.getIdByUrl(ctx.url, 2), ctx.request.files.file);
  },
);

ShopRouter.put(
  '/:id/image',
  security.checkUserScope.bind(this, security.scope.WRITE_SHOPS),
  async ctx => {
    ctx.body = await shops.updateImage(utils.getIdByUrl(ctx.url, 2), ctx.request.body);
  },
);

ShopRouter.delete(
  '/:id/image',
  security.checkUserScope.bind(this, security.scope.WRITE_SHOPS),
  async ctx => {
    ctx.body = await shops.deleteImage(utils.getIdByUrl(ctx.url, 2));
  },
);

export default ShopRouter;
