import Router from 'koa-router';
import utils from '../../../libs/utils';
import sitemapApi from '../../../services/sitemap';
import security from '../../../libs/security';

const sitemapRouter = new Router({prefix: '/v1/sitemap'});

sitemapRouter.get('/', 
    security.checkUserScope.bind(this, security.scope.READ_SITEMAP),
    async ctx => {
    ctx.body = await getPaths(ctx.href);
})

async function getPaths(href) {
    const url = new URL(href);
    const enabled = url.searchParams.get('enabled');
    const queryPath = url.searchParams.get('path');
    if(queryPath) {
        return await sitemapApi.getSinglePath(queryPath, enabled)
    } else {
        return await sitemapApi.getPaths(enabled)
    }
}

export default sitemapRouter;