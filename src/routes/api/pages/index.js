import Router from 'koa-router';
import pagesApi from '../../../services/pages';
import utils from '../../../libs/utils';
import security from '../../../libs/security';

const pageRouter = new Router({prefix: '/v1/pages'});

pageRouter.get('/', 
    security.checkUserScope.bind(this, security.scope.READ_PAGES),
    async ctx => {
    ctx.body = await pagesApi.getPages();
})

pageRouter.post('/', 
    security.checkUserScope.bind(this, security.scope.WRITE_PAGES),
    async ctx => {
    ctx.body = await pagesApi.addPage(ctx.request.body);
})

pageRouter.get('/:id', 
    security.checkUserScope.bind(this, security.scope.READ_PAGES),
    async ctx => {
    ctx.body = await pagesApi.getSinglePage(utils.getIdByUrl(ctx.url, 1));
})

pageRouter.put('/:id',
    security.checkUserScope.bind(this, security.scope.WRITE_PAGES),
    async ctx => {
    ctx.body = await pagesApi.updatePage(utils.getIdByUrl(ctx.url, 1), ctx.request.body);
})

pageRouter.delete('/:id',
    security.checkUserScope.bind(this, security.scope.WRITE_PAGES),
    async ctx => {
    ctx.body = await pagesApi.deletePage(utils.getIdByUrl(ctx.url, 1));
})

export default pageRouter