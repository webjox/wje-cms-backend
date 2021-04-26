import Router from 'koa-router';
import koaBody from 'koa-body';
import security from '../../../libs/security';
import xmlParse from '../../../services/xmlParse';

const importRouter = new Router({ prefix: '/v1/import' });

importRouter.post(
  '/',
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
    const { file } = ctx.request.files;

    if (!file) {
      ctx.status = 400;
      return;
    }

    const result = await xmlParse(file);
    ctx.body = result;
  },
);

export default importRouter;
