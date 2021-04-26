import Router from 'koa-router';
import sitemapApi from '../../../services/sitemap';
import security from '../../../libs/security';

const sitemapRouter = new Router({ prefix: '/v1/sitemap' });

async function getPaths(href) {
  const url = new URL(href);
  const enabled = url.searchParams.get('enabled');
  const queryPath = url.searchParams.get('path');
  if (queryPath) {
    const result = await sitemapApi.getSinglePath(queryPath, enabled);
    return result;
  }
  const result = await sitemapApi.getPaths(enabled);
  return result;
}

sitemapRouter.get(
  '/',
  security.checkUserScope.bind(this, security.scope.READ_SITEMAP),
  async ctx => {
    ctx.body = await getPaths(ctx.href);
  },
);

export default sitemapRouter;
