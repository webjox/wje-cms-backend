import Router from 'koa-router';
import api from '../../../services/api';
import utils from '../../../libs/utils';
import security from '../../../libs/security';

const { productTags } = api;
const productTagsRouter = new Router({ prefix: '/v1/tags' });

productTagsRouter.get(
  '/',
  security.checkUserScope.bind(this, security.scope.READ_TAGS),
  async ctx => {
    const data = await productTags.getTags();
    ctx.body = data;
  },
);

productTagsRouter.get(
  '/:tagId',
  security.checkUserScope.bind(this, security.scope.READ_TAGS),
  async ctx => {
    const data = await productTags.getTagById(utils.getIdByUrl(ctx.url, 1));
    ctx.body = data;
  },
);

productTagsRouter.post(
  '/',
  security.checkUserScope.bind(this, security.scope.WRITE_TAGS),
  async ctx => {
    const data = await productTags.createTag(ctx.request.body);
    ctx.body = data;
  },
);

productTagsRouter.put(
  '/:tagId',
  security.checkUserScope.bind(this, security.scope.WRITE_TAGS),
  async ctx => {
    const data = await productTags.updateTag(utils.getIdByUrl(ctx.url, 1), ctx.request.body);
    ctx.body = data;
  },
);

productTagsRouter.delete(
  '/:tagId',
  security.checkUserScope.bind(this, security.scope.WRITE_TAGS),
  async ctx => {
    const data = await productTags.deleteTag(utils.getIdByUrl(ctx.url, 1));
    ctx.body = data;
  },
);

export default productTagsRouter;
