import categoriesApi from './categories';
import customersApi from './customers';
import customerGroupsApi from './customers/customerGroups';
import ordersApi from './orders';
import orderAddressesApi from './orders/orderAddresses';
import orderDiscountsApi from './orders/orderDiscounts';
import orderItemsApi from './orders/orderItems';
import orderStatusesApi from './orders/orderStatuses';
import orderTransactionsApi from './orders/orderTransactions';
import paymentMethodsApi from './orders/paymentMethods';
import shippingMethodsApi from './orders/shippingMethods';
import pagesApi from './pages';
import productsApi from './products';
import securityApi from './security/tokens';
import settingsApi from './settings/settings';
import checkoutFieldsApi from './settings/checkoutFields';
import commerceApi from './settings/commerce';
import emailApi from './settings/email';
import emailTemplatesApi from './settings/emailTemplates';
import paymentGatewaysApi from './settings/paymentGateways';
import filesApi from './files';
import sitemapApi from './sitemap';
import redirectsApi from './redirects';
import webhooksApi from './webhooks';
import productTags from './productTags';
import ShopsApi from './shops';

const api = {
  categories: categoriesApi,
  customers: customersApi,
  customerGroups: customerGroupsApi,
  orders: ordersApi,
  orderAddresses: orderAddressesApi,
  orderDiscounts: orderDiscountsApi,
  orderItems: orderItemsApi,
  orderStatuses: orderStatusesApi,
  orderTransactions: orderTransactionsApi,
  paymentMethods: paymentMethodsApi,
  shippingMethods: shippingMethodsApi,
  pages: pagesApi,
  products: productsApi,
  security: securityApi,
  settings: settingsApi,
  checkoutFields: checkoutFieldsApi,
  commerce: commerceApi,
  email: emailApi,
  emailTemplates: emailTemplatesApi,
  paymentGateways: paymentGatewaysApi,
  files: filesApi,
  sitemap: sitemapApi,
  redirects: redirectsApi,
  webhooks: webhooksApi,
  productTags,
  shops: ShopsApi,
};

export default api;
