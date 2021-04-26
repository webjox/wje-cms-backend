import Router from 'koa-router';
import utils from '../../../libs/utils';
import settingsApi from '../../../services/settings/settings';
import emailSettingsApi from '../../../services/settings/email';
import emailTemplatesApi from '../../../services/settings/emailTemplates';
import checkoutFieldsApi from '../../../services/settings/checkoutFields';
import commerceSettingsApi from '../../../services/settings/commerce';
import security from '../../../libs/security';

const settingsRouter = new Router({ prefix: '/v1/settings' });

settingsRouter.get(
  '/',
  security.checkUserScope.bind(this, security.scope.READ_SETTINGS),
  async ctx => {
    const result = await settingsApi.getSettings();
    ctx.body = result;
  },
);

settingsRouter.put(
  '/',
  security.checkUserScope.bind(this, security.scope.WRITE_SETTINGS),
  async ctx => {
    ctx.body = await settingsApi.updateSettings(ctx.request.body);
  },
);

settingsRouter.get(
  '/email',
  security.checkUserScope.bind(this, security.scope.READ_SETTINGS),
  async ctx => {
    ctx.body = await emailSettingsApi.getEmailSettings();
  },
);

settingsRouter.put(
  '/email',
  security.checkUserScope.bind(this, security.scope.WRITE_SETTINGS),
  async ctx => {
    ctx.body = await emailSettingsApi.updateEmailSettings(ctx.request.body);
  },
);

settingsRouter.get(
  '/email/templates/:name',
  security.checkUserScope.bind(this, security.scope.READ_SETTINGS),
  async ctx => {
    ctx.body = await emailTemplatesApi.getEmailTemplate(utils.getIdByUrl(ctx.url, 1));
  },
);

settingsRouter.put(
  '/email/templates/:name',
  security.checkUserScope.bind(this, security.scope.WRITE_SETTINGS),
  async ctx => {
    ctx.body = await emailTemplatesApi.updateEmailTemplate(
      utils.getIdByUrl(ctx.url, 1),
      ctx.request.body,
    );
  },
);

settingsRouter.get(
  '/commerceform',
  security.checkUserScope.bind(this, security.scope.READ_SETTINGS),
  async ctx => {
    ctx.body = await commerceSettingsApi.retrieveCommerceSettings();
  },
);

settingsRouter.put(
  '/commerceform',
  security.checkUserScope.bind(this, security.scope.WRITE_SETTINGS),
  async ctx => {
    ctx.body = await commerceSettingsApi.updateCommerceSettings(ctx.request.body);
  },
);

settingsRouter.get(
  '/checkout/fields',
  security.checkUserScope.bind(this, security.scope.READ_SETTINGS),
  async ctx => {
    ctx.body = await checkoutFieldsApi.getCheckoutFields();
  },
);

settingsRouter.get(
  '/checkout/fields/:name',
  security.checkUserScope.bind(this, security.scope.READ_SETTINGS),
  async ctx => {
    ctx.body = await checkoutFieldsApi.getCheckoutField(utils.getIdByUrl(ctx.url, 1));
  },
);

settingsRouter.put(
  '/checkout/fields/:name',
  security.checkUserScope.bind(this, security.scope.WRITE_SETTINGS),
  async ctx => {
    ctx.body = await checkoutFieldsApi.updateCheckoutField(
      utils.getIdByUrl(ctx.url, 1),
      ctx.request.body,
    );
  },
);

settingsRouter.post(
  '/logo',
  security.checkUserScope.bind(this, security.scope.WRITE_SETTINGS),
  async (ctx, next) => {
    ctx.body = await settingsApi.uploadLogo(ctx, next);
  },
);

settingsRouter.delete(
  '/logo',
  security.checkUserScope.bind(this, security.scope.WRITE_SETTINGS),
  async ctx => {
    ctx.body = await settingsApi.deleteLogo();
  },
);

export default settingsRouter;
