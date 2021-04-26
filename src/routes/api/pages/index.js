import Router from 'koa-router';
import koaBody from 'koa-body';
import pagesApi from '../../../services/pages';
import utils from '../../../libs/utils';
import security from '../../../libs/security';

const pageRouter = new Router({ prefix: '/v1/pages' });

pageRouter.get('/', security.checkUserScope.bind(this, security.scope.READ_PAGES), async ctx => {
  ctx.body = await pagesApi.getPages();
});

pageRouter.post('/', security.checkUserScope.bind(this, security.scope.WRITE_PAGES), async ctx => {
  ctx.body = await pagesApi.addPage(ctx.request.body);
});

pageRouter.get('/:id', security.checkUserScope.bind(this, security.scope.READ_PAGES), async ctx => {
  ctx.body = await pagesApi.getSinglePage(utils.getIdByUrl(ctx.url, 1));
});

pageRouter.put(
  '/:id',
  security.checkUserScope.bind(this, security.scope.WRITE_PAGES),
  async ctx => {
    ctx.body = await pagesApi.updatePage(utils.getIdByUrl(ctx.url, 1), ctx.request.body);
  },
);

pageRouter.delete(
  '/:id',
  security.checkUserScope.bind(this, security.scope.WRITE_PAGES),
  async ctx => {
    ctx.body = await pagesApi.deletePage(utils.getIdByUrl(ctx.url, 1));
  },
);

pageRouter.post(
  '/:id/image',
  security.checkUserScope.bind(this, security.scope.WRITE_PAGES),
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
    ctx.body = await pagesApi.uploadCardImage(utils.getIdByUrl(ctx.url, 2), ctx.request.files.file);
  },
);

pageRouter.put(
  '/:id/image',
  security.checkUserScope.bind(this, security.scope.WRITE_PAGES),
  async ctx => {
    ctx.body = await pagesApi.updateCardImage(utils.getIdByUrl(ctx.url, 2), ctx.request.body);
  },
);

pageRouter.delete(
  '/:id/image',
  security.checkUserScope.bind(this, security.scope.WRITE_PAGES),
  async ctx => {
    ctx.body = await pagesApi.deleteCardImage(utils.getIdByUrl(ctx.url, 2));
  },
);

export default pageRouter;
