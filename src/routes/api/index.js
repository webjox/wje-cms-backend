import Router from 'koa-router'
import productsRouter from './products';
import categoriesRouter from './categories';
import customerRouter from './customers';
import customerGroupsRouter from './customerGroups';
import orderStatusesRouter from './orderStatuses';
import filesRouter from './files';
import orderRouter from './orders';
import pageRouter from './pages';
import paymentGatewaysRouter from './paymentGateways';
import paymentMethodsRouter from './paymentMethods';
import redirectsRouter from './redirects';
import settingsRouter from './settings';
import shippingMethodsRouter from './shippingMethods';
import sitemapRouter from './sitemap';
import securityTokensRouter from './tokens';
import productTagsRouter from './productTags';
import importRouter from './productImport';
import shopRouter from './shops';

const apiRouter = new Router({prefix: '/api'});

apiRouter
    .use(productsRouter.routes())
    .use(productsRouter.allowedMethods())
    .use(categoriesRouter.routes())
    .use(categoriesRouter.allowedMethods())
    .use(customerRouter.routes())
    .use(customerRouter.allowedMethods())
    .use(customerGroupsRouter.routes())
    .use(customerGroupsRouter.allowedMethods())
    .use(orderStatusesRouter.routes())
    .use(orderStatusesRouter.allowedMethods())
    .use(filesRouter.routes())
    .use(filesRouter.allowedMethods())
    .use(orderRouter.routes())
    .use(orderRouter.allowedMethods())
    .use(pageRouter.routes())
    .use(pageRouter.allowedMethods())
    .use(paymentGatewaysRouter.routes())
    .use(paymentGatewaysRouter.allowedMethods())
    .use(paymentMethodsRouter.routes())
    .use(paymentMethodsRouter.allowedMethods())
    .use(redirectsRouter.routes())
    .use(redirectsRouter.allowedMethods())
    .use(settingsRouter.routes())
    .use(settingsRouter.allowedMethods())
    .use(shippingMethodsRouter.routes())
    .use(shippingMethodsRouter.allowedMethods())
    .use(sitemapRouter.routes())
    .use(sitemapRouter.allowedMethods())
    .use(securityTokensRouter.routes())
    .use(securityTokensRouter.allowedMethods())
    .use(productTagsRouter.routes())
    .use(productTagsRouter.allowedMethods())
    .use(importRouter.routes())
    .use(importRouter.allowedMethods())
    .use(shopRouter.routes())
    .use(shopRouter.allowedMethods())

export default apiRouter;