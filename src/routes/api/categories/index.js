import Router from 'koa-router';
import koaBody from 'koa-body';
import categoriesApi from '../../../services/categories';
import utils from '../../../libs/utils';
import security from '../../../libs/security';

const categoriesRouter = new Router({ prefix: '/v1/categories' });

categoriesRouter.get(
  '/',
  security.checkUserScope.bind(this, security.scope.READ_PRODUCT_CATEGORIES),
  async ctx => {
    const result = await categoriesApi.getCategories();
    ctx.body = result;
  },
);

categoriesRouter.post(
  '/',
  security.checkUserScope.bind(this, security.scope.WRITE_PRODUCT_CATEGORIES),
  async ctx => {
    ctx.body = await categoriesApi.addCategory(ctx.request.body);
  },
);

categoriesRouter.get(
  '/:id',
  security.checkUserScope.bind(this, security.scope.READ_PRODUCT_CATEGORIES),
  async ctx => {
    ctx.body = await categoriesApi.getSingleCategory(utils.getIdByUrl(ctx.url, 1));
  },
);

categoriesRouter.put(
  '/:id',
  security.checkUserScope.bind(this, security.scope.WRITE_PRODUCT_CATEGORIES),
  async ctx => {
    ctx.body = await categoriesApi.updateCategory(utils.getIdByUrl(ctx.url, 1), ctx.request.body);
  },
);

categoriesRouter.delete(
  '/:id',
  security.checkUserScope.bind(this, security.scope.WRITE_PRODUCT_CATEGORIES),
  async ctx => {
    ctx.body = await categoriesApi.deleteCategory(utils.getIdByUrl(ctx.url, 1));
  },
);

categoriesRouter.get(
  '/:id/image',
  security.checkUserScope.bind(this, security.scope.WRITE_PRODUCT_CATEGORIES),
  async ctx => {
    const result = await categoriesApi.getCategoryImage(utils.getIdByUrl(ctx.url, 2));
    ctx.body = result;
  },
);

categoriesRouter.post(
  '/:id/image',
  security.checkUserScope.bind(this, security.scope.WRITE_PRODUCT_CATEGORIES),
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
    const result = await categoriesApi.uploadCategoryImage(
      ctx.request.files.file,
      utils.getIdByUrl(ctx.url, 2),
    );
    ctx.body = result;
  },
);

categoriesRouter.put(
  '/:id/image',
  security.checkUserScope.bind(this, security.scope.WRITE_PRODUCT_CATEGORIES),
  async ctx => {
    const result = await categoriesApi.updateCategoryImage(
      utils.getIdByUrl(ctx.url, 2),
      ctx.request.body,
    );
    ctx.body = result;
  },
);

categoriesRouter.delete(
  '/:id/image',
  security.checkUserScope.bind(this, security.scope.WRITE_PRODUCT_CATEGORIES),
  async ctx => {
    const result = await categoriesApi.deleteCategoryImage(utils.getIdByUrl(ctx.url, 2));
    ctx.body = result;
  },
);

export default categoriesRouter;
