import Router from 'koa-router';
import koaBody from 'koa-body';
import api from '../../../services/api';
import security from '../../../libs/security';
import productEffectsData from '../../../../config/productEffectsData.json';

const productsRouter = new Router({ prefix: '/v1/products' });
const productApi = api.products;

function getIdByUrl(url, index = 1) {
  const parserUrl = url.split('/');
  return parserUrl[parserUrl.length - index];
}

// main crud products

// access get requests
productsRouter.get(
  '/',
  security.checkUserScope.bind(this, security.scope.READ_PRODUCTS),
  async ctx => {
    const objects = await productApi.getProductList({});
    ctx.body = objects;
    ctx.status = 200;
  },
);

productsRouter.post(
  '/',
  security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS),
  async ctx => {
    const data = await productApi.addProduct(ctx.request.body);
    ctx.body = data;
  },
);

productsRouter.get(
  '/:product',
  security.checkUserScope.bind(this, security.scope.READ_PRODUCTS),
  async ctx => {
    const data = await productApi.getProductById(getIdByUrl(ctx.url));
    ctx.body = data;
  },
);

productsRouter.put(
  '/:product',
  security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS),
  async ctx => {
    const data = await productApi.updateProduct(getIdByUrl(ctx.url), ctx.request.body);
    ctx.body = data;
  },
);

productsRouter.delete(
  '/:product',
  security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS),
  async ctx => {
    await productApi.deleteProduct(getIdByUrl(ctx.url));
    ctx.body = `Product was removed`;
  },
);

productsRouter.get(
  '/:product/sku',
  security.checkUserScope.bind(this, security.scope.READ_PRODUCTS),
  async ctx => {
    const data = await productApi.getProductById(getIdByUrl(ctx.url, 2));
    ctx.body = data.sku;
  },
);

productsRouter.get(
  '/:product/slug',
  security.checkUserScope.bind(this, security.scope.READ_PRODUCTS),
  async ctx => {
    const data = await productApi.getProductById(getIdByUrl(ctx.url, 2));
    ctx.body = data.slug;
  },
);

// end main crud products

// product images start
productsRouter.get(
  '/:product/images',
  security.checkUserScope.bind(this, security.scope.READ_PRODUCTS),
  async ctx => {
    const images = await productApi.getImages(getIdByUrl(ctx.url, 2));
    ctx.body = images;
  },
);

productsRouter.post(
  '/:product/images',
  security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS),
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
    const result = await productApi.addImage(ctx, getIdByUrl(ctx.url, 2));
    ctx.body = result;
  },
);

productsRouter.put(
  '/:product/images/:imageId',
  security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS),
  async ctx => {
    const product = await productApi.updateImage(
      getIdByUrl(ctx.url, 3),
      getIdByUrl(ctx.url, 1),
      ctx.request.body,
    );
    ctx.body = product;
  },
);

productsRouter.delete(
  '/:product/images/:imageId',
  security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS),
  async ctx => {
    await productApi.deleteImage(getIdByUrl(ctx.url, 3), getIdByUrl(ctx.url, 1));
  },
);

// end product images

// product files start
productsRouter.get(
  '/:product/files',
  security.checkUserScope.bind(this, security.scope.READ_PRODUCTS),
  async ctx => {
    const files = await productApi.getFiles(getIdByUrl(ctx.url, 2));
    ctx.body = files;
  },
);

productsRouter.post(
  '/:product/files',
  security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS),
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
    const result = await productApi.addFile(ctx, getIdByUrl(ctx.url, 2));
    ctx.body = result;
  },
);

productsRouter.delete(
  '/:product/files/:fileId',
  security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS),
  async ctx => {
    await productApi.deleteFile(getIdByUrl(ctx.url, 3), getIdByUrl(ctx.url, 1));
  },
);

// product files end

// start product shop

productsRouter.post(
  '/:product/shops',
  security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS),
  async ctx => {
    try {
      const data = await productApi.addShop(getIdByUrl(ctx.url, 2), ctx.request.body);
      ctx.body = data;
    } catch (error) {
      ctx.status = 400;
      ctx.body = { error: 'true', message: error };
    }
  },
);

productsRouter.put(
  '/:product/shops/:shopId',
  security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS),
  async ctx => {
    const data = await productApi.updateShop(
      getIdByUrl(ctx.url, 3),
      getIdByUrl(ctx.url, 1),
      ctx.request.body,
    );
    ctx.body = data;
  },
);

productsRouter.delete(
  '/:product/shops/:shopId',
  security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS),
  async ctx => {
    try {
      const data = await productApi.deleteShop(getIdByUrl(ctx.url, 3), getIdByUrl(ctx.url, 1));
      ctx.body = data;
    } catch (error) {
      ctx.status = 400;
      ctx.body = { status: 'error', message: error };
    }
  },
);
// end product shops

// start product options
productsRouter.get(
  '/:product/options',
  security.checkUserScope.bind(this, security.scope.READ_PRODUCTS),
  async ctx => {
    const data = await productApi.getOptions(getIdByUrl(ctx.url, 2));
    ctx.body = data;
  },
);

productsRouter.get(
  '/:product/options/:optionId',
  security.checkUserScope.bind(this, security.scope.READ_PRODUCTS),
  async ctx => {
    const data = await productApi.getSingleOption(getIdByUrl(ctx.url, 3), getIdByUrl(ctx.url, 1));
    ctx.body = data;
  },
);

productsRouter.post(
  '/:product/options',
  security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS),
  async ctx => {
    try {
      const data = await productApi.addOption(getIdByUrl(ctx.url, 2), ctx.request.body);
      ctx.body = data;
    } catch (error) {
      ctx.status = 400;
      ctx.body = { error: 'true', message: error };
    }
  },
);

productsRouter.put(
  '/:product/options/:optionId',
  security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS),
  async ctx => {
    const data = await productApi.updateOption(
      getIdByUrl(ctx.url, 3),
      getIdByUrl(ctx.url, 1),
      ctx.request.body,
    );
    ctx.body = data;
  },
);

productsRouter.delete(
  '/:product/options/:optionId',
  security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS),
  async ctx => {
    try {
      const data = await productApi.deleteOption(getIdByUrl(ctx.url, 3), getIdByUrl(ctx.url, 1));
      ctx.body = data;
    } catch (error) {
      ctx.status = 400;
      ctx.body = { error: 'true' };
    }
  },
);
// end product Options

// start product Values
productsRouter.get(
  '/:product/options/:optionId/values',
  security.checkUserScope.bind(this, security.scope.READ_PRODUCTS),
  async ctx => {
    const data = await productApi.getOptionValues(getIdByUrl(ctx.url, 4), getIdByUrl(ctx.url, 2));
    ctx.body = data;
  },
);

productsRouter.get(
  '/:product/options/:optionId/values/:valueId',
  security.checkUserScope.bind(this, security.scope.READ_PRODUCTS),
  async ctx => {
    const data = await productApi.getSingleOptionValue(
      getIdByUrl(ctx.url, 5),
      getIdByUrl(ctx.url, 3),
      getIdByUrl(ctx.url, 1),
    );
    ctx.body = data;
  },
);

productsRouter.post(
  '/:product/options/:optionId/values',
  security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS),
  async ctx => {
    const data = await productApi.addOptionValue(
      getIdByUrl(ctx.url, 4),
      getIdByUrl(ctx.url, 2),
      ctx.request.body,
    );
    ctx.body = data;
  },
);

productsRouter.put(
  '/:product/options/:optionId/values/:valueId',
  security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS),
  async ctx => {
    const data = await productApi.updateOptionValue(
      getIdByUrl(ctx.url, 5),
      getIdByUrl(ctx.url, 3),
      getIdByUrl(ctx.url, 1),
      ctx.request.body,
    );
    ctx.body = data;
  },
);

productsRouter.delete(
  '/:product/options/:optionId/values/:valueId',
  security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS),
  async ctx => {
    const data = await productApi.deleteOptionValue(
      getIdByUrl(ctx.url, 5),
      getIdByUrl(ctx.url, 3),
      getIdByUrl(ctx.url, 1),
    );
    ctx.body = data;
  },
);
// end product Values

// start product variants
productsRouter.get(
  '/:product/variants',
  security.checkUserScope.bind(this, security.scope.READ_PRODUCTS),
  async ctx => {
    const data = await productApi.getVariants(getIdByUrl(ctx.url, 2));
    ctx.body = data;
  },
);

productsRouter.post(
  '/:product/variants',
  security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS),
  async ctx => {
    const data = await productApi.addVariant(getIdByUrl(ctx.url, 2), ctx.request.body);
    ctx.body = data;
  },
);

productsRouter.put(
  '/:product/variants/:variantId',
  security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS),
  async ctx => {
    const data = await productApi.updateVariant(
      getIdByUrl(ctx.url, 3),
      getIdByUrl(ctx.url, 1),
      ctx.request.body,
    );
    ctx.body = data;
  },
);

productsRouter.delete(
  '/:product/variants/:variantId',
  security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS),
  async ctx => {
    const data = await productApi.getVariants(getIdByUrl(ctx.url, 3), getIdByUrl(ctx.url, 1));
    ctx.body = data;
  },
);

productsRouter.put(
  '/:product/variants/:variantId/options',
  security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS),
  async ctx => {
    const data = await productApi.setVariantOptions(
      getIdByUrl(ctx.url, 4),
      getIdByUrl(ctx.url, 2),
      ctx.request.body,
    );
    ctx.body = data;
  },
);
// end product variants

// start get product Effects
productsRouter.get(
  '/effects',
  security.checkUserScope.bind(this, security.scope.READ_PRODUCTS),
  async ctx => {
    ctx.body = productEffectsData.data;
  },
);
// end product effects

export default productsRouter;
