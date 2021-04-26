import Router from 'koa-router';
import filesApi from '../../../services/files';
import utils from '../../../libs/utils';
import security from '../../../libs/security';

const filesRouter = new Router({ prefix: '/v1/files' });

filesRouter.get('/', security.checkUserScope.bind(this, security.scope.READ_FILES), async ctx => {
  ctx.body = await filesApi.getFiles();
});

filesRouter.post('/', security.checkUserScope.bind(this, security.scope.WRITE_FILES), async ctx => {
  ctx.body = await filesApi.uploadFile(ctx.request.files);
});

filesRouter.delete(
  '/:id',
  security.checkUserScope.bind(this, security.scope.WRITE_FILES),
  async ctx => {
    ctx.body = await filesApi.deleteFile(utils.getIdByUrl(ctx.url, 1));
  },
);

export default filesRouter;
