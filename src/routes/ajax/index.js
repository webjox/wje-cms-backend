import Router from 'koa-router';
import handlebars from 'handlebars';
import logger from 'winston';
import bcrypt from 'bcrypt';
import config from '../../../config';
import authHeader from '../../libs/auth-header';
import mailer from '../../libs/mailer';
import emailTemplatesApi from '../../services/settings/emailTemplates';
import settingsApi from '../../services/settings/settings';
import orderItemsApi from '../../services/orders/orderItems';
import filterRequestData from '../../services/filterRequestData';
import api from '../../services/api';
import utils from '../../libs/utils';
import models from '../../services/models';
import paymentGateways from '../../paymentGateways';
import productEffectsData from '../../../config/productEffectsData.json';
import productManufacturersData from '../../../config/productManufacturersData.json';

const { saltRounds } = config;

const ajaxRouter = new Router({ prefix: '/ajax' });
const DEFAULT_CACHE_CONTROL = 'public, max-age=60';
const PRODUCT_DETAILS_CACHE_CONTROL = 'public, max-age=60';
const CATEGORIES_DETAILS_CACHE_CONTROL = 'public, max-age=60';

// const getCartCookieOptions = isHttps => ({
//   maxAge: 24 * 60 * 60 * 1000, // 24 hours
//   httpOnly: true,
//   signed: true,
//   secure: isHttps,
//   sameSite: 'strict',
// });

const getIP = req => {
  let ip = req.get('x-forwarded-for') || req.ip;

  if (ip && ip.includes(', ')) {
    const ipArray = ip.split(', ');
    // eslint-disable-next-line prefer-destructuring
    ip = ipArray[0];
  }

  if (ip && ip.includes('::ffff:')) {
    ip = ip.replace('::ffff:', '');
  }
  return ip;
};

const getUserAgent = req => {
  const userAgent = req.get('user-agent');
  return userAgent;
};

const fillCartItemWithProductData = (products, cartItem) => {
  const product = products.find(p => p._id === cartItem.product_id);
  if (product) {
    cartItem.image_url = product.images && product.images.length > 0 ? product.images[0].url : null;
    cartItem.path = product.path;
    cartItem.stock_backorder = product.stock_backorder;
    cartItem.stock_preorder = product.stock_preorder;
    if (cartItem.variant_id && cartItem.variant_id.length > 0) {
      const variant = orderItemsApi.getVariantFromProduct(product, cartItem.variant_id);
      cartItem.stock_quantity = variant ? variant.stock_quantity : 0;
    } else {
      cartItem.stock_quantity = product.stock_quantity;
    }
  }
  return cartItem;
};

const fillCartItems = async cartResponse => {
  const cart = cartResponse.json;
  if (cart && cart.items && cart.items.length > 0) {
    const productIds = cart.items.map(item => item.product_id);
    const products = await api.products.getProductList({
      _id: { $or: productIds },
      fields: 'images,enabled,stock_quantity,variants,path,stock_backorder,stock_preorder',
    });
    const newCartItem = cart.items.map(cartItem =>
      fillCartItemWithProductData(products.data, cartItem),
    );
    cartResponse.json.items = newCartItem;
    return cartResponse;
  }
  return cartResponse;
};

ajaxRouter.get('/products', async ctx => {
  const filter = { ...ctx.request.query };
  filter.enabled = true;
  if (filter.search) {
    const data = await api.products.searchProductByText(filter.search);
    ctx.body = data;
    ctx.set(`Cache-Control`, PRODUCT_DETAILS_CACHE_CONTROL);
    return;
  }
  const data = await api.products.getProductList(filter);
  if (typeof data === 'string') ctx.status = 400;
  ctx.body = data;
  ctx.set(`Cache-Control`, PRODUCT_DETAILS_CACHE_CONTROL);
});

ajaxRouter.get('/products/tags', async ctx => {
  const productTags = await api.productTags.getTags();
  ctx.body = productTags;
  ctx.set(`Cache-Control`, PRODUCT_DETAILS_CACHE_CONTROL);
});

ajaxRouter.get('/products/tags/:id', async ctx => {
  const productTag = await api.productTags.getTagById(utils.getIdByUrl(ctx.url, 1));
  ctx.body = productTag;
  ctx.set(`Cache-Control`, PRODUCT_DETAILS_CACHE_CONTROL);
});

ajaxRouter.get('/products/effects', ctx => {
  ctx.body = productEffectsData.data;
});

ajaxRouter.get('/products/manufacturers', ctx => {
  ctx.body = productManufacturersData.data;
});

ajaxRouter.get('/products/:id', async ctx => {
  const product = await api.products.getProductById(utils.getIdByUrl(ctx.url, 1));
  ctx.body = product;
  ctx.set(`Cache-Control`, PRODUCT_DETAILS_CACHE_CONTROL);
});

ajaxRouter.get('/products/:id/images', async ctx => {
  const images = await api.products.getImages(utils.getIdByUrl(ctx.url, 2));
  ctx.body = images;
  ctx.set(`Cache-Control`, PRODUCT_DETAILS_CACHE_CONTROL);
});

ajaxRouter.get('/products/:id/files', async ctx => {
  const files = await api.products.getFiles(utils.getIdByUrl(ctx.url, 2));
  ctx.body = files;
  ctx.set(`Cache-Control`, PRODUCT_DETAILS_CACHE_CONTROL);
});

ajaxRouter.get('/categories', async ctx => {
  const filter = {};
  filter.enabled = true;
  const categories = await api.categories.getCategories(filter);
  ctx.body = categories;
  ctx.set(`Cache-Control`, CATEGORIES_DETAILS_CACHE_CONTROL);
});

ajaxRouter.get('/categories/:id', async ctx => {
  const category = await api.categories.getSingleCategory(utils.getIdByUrl(ctx.url, 1));
  ctx.body = category;
  ctx.set(`Cache-Control`, CATEGORIES_DETAILS_CACHE_CONTROL);
});

ajaxRouter.get('/categories/:id/image', async ctx => {
  const image = await api.categories.getCategoryImage(utils.getIdByUrl(ctx.url, 2));
  if (image) ctx.body = image;
  else ctx.body = 'images not found';
  ctx.set(`Cache-Control`, DEFAULT_CACHE_CONTROL);
});

ajaxRouter.get('/shops', async ctx => {
  ctx.body = await api.shops.getShops();
});

ajaxRouter.get('/payment_methods', async ctx => {
  ctx.body = await api.paymentMethods.getMethods();
});

ajaxRouter.get('/shipping_methods', async ctx => {
  ctx.body = await api.shippingMethods.getMethods();
});

ajaxRouter.get('/cart', async ctx => {
  const orderId = ctx.cookies.get('order_id');
  if (orderId) {
    const order = await api.orders.getSingleOrder(orderId);
    const cartResponse = await fillCartItems(order);
    cartResponse.browser = undefined;
    ctx.body = cartResponse;
  } else {
    ctx.status = 403;
    ctx.body = "Order doesn't exist";
  }
});

ajaxRouter.post('/reset-password', async ctx => {
  const hashPassword = await bcrypt.hash(ctx.request.body.password, saltRounds);
  const data = {
    status: false,
    id: null,
    verified: false,
  };

  const userId =
    `token` in ctx.request.body
      ? authHeader.decodeUserLoginAuth(ctx.request.body.token)
      : authHeader.decodeUserLoginAuth(ctx.request.body.id).userId.userId;

  const filter = {
    id: userId,
  };
  const customerDraft = {
    password: hashPassword,
  };

  if (`id` in ctx.request.body) {
    const result = await api.customers.updateCustomer(userId, customerDraft);
    if (result) {
      data.status = true;
      data.id = userId;
      data.verified = true;
      ctx.body = data;
    } else {
      return false;
    }
  }

  if (`name` in userId && userId.name.indexOf(`JwonWebTokenErro`) !== -1) {
    ctx.body = data;
    return false;
  }

  const customerData = await api.customers.getSingleCustomer(filter.id);
  if (customerData) {
    data.status = true;
    data.id = authHeader.encodeUserLoginAuth(userId);
  }
  ctx.body = data;
});

ajaxRouter.post('/forgot-password', async ctx => {
  const requestBody = ctx.request.body;
  const filter = {
    email: requestBody.email.toLowerCase(),
  };
  const data = {
    status: true,
  };

  async function sendEmail(userId) {
    const countryCode = undefined;
    const emailTemplate = await emailTemplatesApi.getEmailTemplate(
      `forgot_password_${config.language}`,
    );
    await handlebars.registerHelper(`forgot_password_link`, () => {
      const url = `${config.storeBaseUrl}${
        countryCode !== undefined ? `/${countryCode}/` : '/'
      }reset-password?token=${authHeader.encodeUserLoginAuth(userId)}`;
      let text = emailTemplate.link;
      if (text === undefined) {
        text = url;
      }
      return new handlebars.SafeString(
        `<a style="position: relative;text-transform: uppercase;border: 1px solid #ccc;color: #000;padding: 5px;text-decoration: none;" value="${text}" href="${url}"> ${text} </a>`,
      );
    });
    const bodyTemplate = await handlebars.compile(emailTemplate.body);
    const settings = await settingsApi.getSettings();
    await mailer.send({
      to: requestBody.email,
      subject: `${emailTemplate.subject} ${settings.store_name}`,
      html: bodyTemplate({
        shop_name: settings.store_name,
      }),
    });
    ctx.body = data;
  }

  const customers = await api.customers.getCustomers(filter);
  if (customers.total_count < 1) {
    data.status = false;
    ctx.body = data;
    return false;
  }
  sendEmail(customers.data[0]._id);
});

ajaxRouter.post('/customer-account', async ctx => {
  const customerData = {
    token: '',
    authenticated: false,
    customer_settings: null,
    order_statuses: null,
  };
  const requestBody = ctx.request.body;
  if (requestBody.token) {
    customerData.token = authHeader.decodeUserLoginAuth(requestBody.token);
    if (customerData.token.userId !== undefined) {
      let userId = null;
      try {
        userId = JSON.stringify(customerData.token.userId).replace(/["']/g, '');
      } catch (error) {
        logger.error(error);
      }

      const filter = {
        customer_id: userId,
      };

      // get customer data
      const customer = await api.customers.getSingleCustomer(userId);
      customerData.customer_settings = customer;
      customerData.customer_settings.password = '*****';
      customerData.token = authHeader.encodeUserLoginAuth(userId);
      customerData.authenticated = false;

      // get orders data
      const orders = await api.orders.getOrders(filter);
      customerData.order_statuses = orders;
      ctx.body = JSON.stringify(customerData);
    }
  } else {
    ctx.status = 400;
    ctx.body = `Bad request, token is undefined`;
  }
});

ajaxRouter.post(`/login`, async ctx => {
  const requestBody = ctx.request.body;
  const customerData = {
    token: '',
    authenticated: false,
    loggedin_failed: false,
    customer_settings: null,
    order_statuses: null,
    cartLayer: requestBody.cartLayer !== undefined ? requestBody.cartLayer : false,
  };
  try {
    const customers = await api.customers.getCustomers({
      email: requestBody.email,
    });

    if (customers.total_count < 1) {
      customerData.loggedin_failed = true;
      ctx.body = JSON.stringify(customerData);
    }

    const customer = customers.data[0];
    const resultOfCompare = await bcrypt.compare(requestBody.password, customer.password);
    if (resultOfCompare === true) {
      customerData.token = authHeader.encodeUserLoginAuth(customer._id);
      customerData.authenticated = true;
      customerData.customer_settings = customer;
      customerData.customer_settings.password = '*****';

      const filter = {
        customer_id: customer._id,
      };

      const orders = await api.orders.getOrders(filter);
      customerData.order_statuses = orders;
      ctx.body = customerData;
    } else {
      ctx.status = 403;
      ctx.body = 'access denied';
    }
    return true;
  } catch (error) {
    logger.error(error);
    ctx.body = `access denied`;
    ctx.status = 500;
  }
});

ajaxRouter.post(`/register`, async ctx => {
  const requestBody = ctx.request.body;
  const data = {
    status: false,
    isRightToken: true,
    isCustomerSaved: false,
    isUserExist: false,
  };
  const filter = {
    email: requestBody.email,
  };

  // check if url params contains token
  const requestToken = requestBody.token ? requestBody.token : false;

  if (requestToken && !data.status) {
    const requestTokenArray = requestToken.split(`xXx`);
    // if requestToken array has no splitable part response token is wrong
    if (requestTokenArray.length < 2) {
      data.isRightToken = false;
      ctx.body = data;
      ctx.status = 200;
      return false;
    }

    (async () => {
      // decode token parts and check if valid email is the second part of them
      const firstName = await authHeader.decodeUserLoginAuth(requestTokenArray[0]).userId;
      const lastName = await authHeader.decodeUserLoginAuth(requestTokenArray[1]).userId;
      const email = await authHeader.decodeUserLoginAuth(requestTokenArray[2]).userId;
      const password = await authHeader.decodeUserPassword(requestTokenArray[3]).password;

      if (
        requestTokenArray.length < 1 ||
        !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          email,
        )
      ) {
        data.isRightToken = false;
        ctx.body = data;
        return false;
      }

      // check once if customer email is existing in database
      filter.email = email;
      const customers = await api.customers.getCustomers(filter);
      if (customers.total_count > 0) {
        data.isUserExist = true;
        return false;
      }

      // generate password-hash
      const salt = await bcrypt.genSalt(saltRounds);
      const hashPassword = await bcrypt.hash(password, salt);
      const customerDraft = {
        full_name: `${firstName} ${lastName}`,
        first_name: firstName,
        last_name: lastName,
        email: email.toLowerCase(),
        password: hashPassword,
      };
      await api.customers.addCustomer(customerDraft);
    })();
    data.isCustomerSaved = true;
    ctx.body = data;
    return true;
  }

  async function registerCustomer() {
    if (data.status) {
      const tokenConcatString = `${authHeader.encodeUserLoginAuth(
        requestBody.first_name,
      )}xXx${authHeader.encodeUserLoginAuth(
        requestBody.last_name,
      )}xXx${authHeader.encodeUserLoginAuth(requestBody.email)}xXx${authHeader.encodeUserPassword(
        requestBody.password,
      )}`;
      const countryCode = undefined;
      const emailTemplate = await api.emailTemplates.getEmailTemplate(
        `register_doi_${config.language}`,
      );
      await handlebars.registerHelper(`register_doi_link`, () => {
        const url = `${config.storeBaseUrl}${
          countryCode !== undefined ? `/${countryCode}/` : '/'
        }login?token=${tokenConcatString}`;
        let text = emailTemplate.link;
        if (text === undefined) {
          text = url;
        }
        return new handlebars.SafeString(
          `<a style="position: relative;text-transform: uppercase;border: 1px solid #ccc;color: #000;padding: 5px;text-decoration: none;" value="${text}" href="${url}"> ${text} </a>`,
        );
      });
      let bodyTemplate;
      try {
        bodyTemplate = await handlebars.compile(emailTemplate.body);
      } catch (error) {
        logger.error(error.toString());
        return false;
      }
      const settings = await api.settings.getSettings();
      await mailer.send({
        to: requestBody.email,
        subject: `${emailTemplate.subject} ${settings.store_name}`,
        html: bodyTemplate({
          shop_name: settings.store_name,
        }),
      });
    }
  }
  // check if customer exist in database
  if (!requestToken) {
    const customers = await api.customers.getCustomers(filter);
    if (customers.total_count > 0) {
      data.isUserExist = true;
      ctx.body = data;
      return false;
    }
    data.status = true;
    registerCustomer();
    ctx.status = 200;
    ctx.body = data;
  } else {
    ctx.status = 500;
  }
});

ajaxRouter.put(`/customer-account`, async ctx => {
  const requestBody = ctx.request.body;
  const token = authHeader.decodeUserLoginAuth(requestBody.token);
  let { userId } = token;
  try {
    userId = JSON.stringify(token.userId).replace(/["']/g, '');
  } catch (error) {
    logger.error(error);
  } // why????

  const customerDataObj = {
    token: '',
    authenticated: false,
    customer_settings: null,
    order_statuses: null,
  };

  const data = await api.customers.getSingleCustomer(userId);
  const customerDraftObj = filterRequestData.filterData(requestBody, `customer`);
  // add featured_products
  if (data.featured_products && customerDraftObj.featured_products) {
    const tempArr = [...data.featured_products];
    for (let i = 0; i < data.featured_products.length; i += 1) {
      if (customerDraftObj.featured_products[0] === data.featured_products[i]) {
        tempArr.splice(i, 1);
        customerDraftObj.featured_products = tempArr;
      } else if (i === data.featured_products.length - 1) {
        tempArr.push(customerDraftObj.featured_products[0]);
        customerDraftObj.featured_products = tempArr;
      }
    }
  }

  const filter = {
    email: requestBody.email,
  };

  // update customer profile and addresses
  const customers = await api.customers.getCustomers(filter);
  // if customer email exists already do not update
  if (customers.total_count > 0) {
    delete customerDraftObj.email;
  }

  try {
    // update customer
    const customerUpdated = await api.customers.updateCustomer(userId, customerDraftObj);
    customerDataObj.customer_settings = customerUpdated;
    customerDataObj.customer_settings.password = '*****';
    customerDataObj.token = authHeader.encodeUserLoginAuth(userId);
    requestBody.authenticated = false;

    if (requestBody.saved_addresses === 0) {
      let objJsonB64 = JSON.stringify(customerDataObj);
      objJsonB64 = Buffer.from(objJsonB64).toString(`base64`);
      ctx.body = objJsonB64;
      ctx.status = 200;
      return false;
    }

    // updateOrders
    await models.orderModel.updateMany(
      { customer_id: userId },
      {
        $set: {
          shipping_address: customerDataObj.shipping_address,
          billing_address: customerDataObj.billing_address,
        },
      },
    );
    ctx.body = customerDataObj;
    ctx.status = 200;
  } catch (error) {
    ctx.status = 400;
    logger.error(error.toString());
    ctx.body = error;
  }
});

ajaxRouter.get('/cart/items', async ctx => {
  const orderId = ctx.cookies.get('order_id');
  if (orderId) {
    try {
      const order = await api.orders.getSingleOrder(orderId);
      const cartResponse = await fillCartItems(order.items);
      ctx.body = cartResponse;
      ctx.status = 200;
    } catch (error) {
      ctx.body = { error: error.toString() };
      ctx.status = 500;
    }
  } else {
    ctx.status = 400;
    ctx.body = 'order_id not found';
  }
});

ajaxRouter.post(`/cart/items`, async ctx => {
  // const isHttps = ctx.request.protocol === `https`;
  // const CART_COOKIE_OPTIONS = getCartCookieOptions(isHttps);

  const orderId = ctx.cookies.get(`order_id`);
  const item = ctx.request.body;
  if (orderId) {
    const updatedOrder = await api.orderItems.addItem(orderId, item);
    const cartResponse = await fillCartItems(updatedOrder);
    ctx.body = cartResponse;

    ctx.status = 200;
  } else {
    const orderDraft = {
      draft: true,
      referrer_url: ctx.cookies.get(`referrer_url`),
      landing_url: ctx.cookies.get(`landing_url`),
      browser: {
        ip: getIP(ctx.request),
        user_agent: getUserAgent(ctx.request),
      },
      shipping_address: {},
    };

    const storeSettings = await api.settings.getSettings();

    orderDraft.shipping_address.address1 = storeSettings.default_shipping_address1;

    orderDraft.shipping_address.address1 = storeSettings.default_shipping_address2;

    orderDraft.shipping_address.country = storeSettings.default_shipping_country;

    orderDraft.shipping_address.state = storeSettings.default_shipping_state;

    orderDraft.shipping_address.city = storeSettings.default_shipping_city;
    orderDraft.item_tax_included = storeSettings.tax_included;
    orderDraft.tax_rate = storeSettings.tax_rate;

    const newOrder = await api.orders.addOrder(orderDraft);
    const newOrderId = newOrder._id;
    const updatedOrder = await api.orderItems.addItem(newOrderId, item);
    const cartResponse = await fillCartItems(updatedOrder);
    ctx.cookies.set('order_id', newOrderId);
    ctx.status = 200;
    ctx.body = cartResponse;
  }
});

ajaxRouter.delete(`/cart/items/:item_id`, async ctx => {
  const orderId = ctx.cookies.get(`order_id`);
  const itemId = utils.getIdByUrl(ctx.url, 1);
  if (orderId && itemId) {
    const cartResponse = await api.orderItems.deleteItem(orderId, itemId);
    const cartData = await fillCartItems(cartResponse.items);
    ctx.status = 200;
    ctx.body = cartData;
  } else {
    ctx.status = 400;
    ctx.body = `Bad request`;
  }
});

ajaxRouter.put(`/cart/items/:itemId`, async ctx => {
  const orderId = ctx.cookies.get(`order_id`);
  const itemId = utils.getIdByUrl(ctx.url, 1);
  const item = ctx.request.body;
  if (orderId && itemId) {
    const updatedItem = await api.orderItems.updateItem(orderId, itemId, item);
    const updatedCart = await fillCartItems(updatedItem.items);
    ctx.body = updatedCart;
    ctx.status = 200;
  } else {
    ctx.status = 400;
    ctx.body = `Bad request`;
  }
});

ajaxRouter.put(`/cart/checkout`, async ctx => {
  const orderId = ctx.cookies.get(`order_id`);
  const shopId = ctx.request.body.shop_id;
  if (orderId && shopId) {
    const cartResponse = await api.orders.checkoutOrder(orderId, shopId);
    const cart = await fillCartItems(cartResponse);
    // let paths = '';
    // generate pdp landing url for the ordered product.
    // more than 1 product in ordered will return comma separated url.
    // [].slice.call(cart.items).forEach(items => {
    //     paths += data.items.length < 2 ?
    //     `${config.storeBaseUrl}${items.path}` :
    //     `${config.storeBaseUrl}${items.path},`;
    // });
    // const data = {
    //     landing_url: paths
    // };
    // await api.orders.updateOrder(order_id, data);
    ctx.cookies.set(`order_id`);
    ctx.body = cart;
    ctx.status = 200;
  } else {
    ctx.body = 'order_id or shop_id not found';
    ctx.status = 400;
  }
});

ajaxRouter.put(`/cart`, async ctx => {
  const cartData = ctx.request.body;
  const { shipping_address: shippingAddress } = cartData;
  const orderId = ctx.cookies.get(`order_id`);
  if (orderId) {
    if (shippingAddress) {
      await api.orderAddresses.updateShippingAddress(orderId, shippingAddress);
    }

    const cartResponse = await api.orders.updateOrder(orderId, cartData);
    const cart = await fillCartItems(cartResponse);
    ctx.body = cart;
    ctx.status = 200;
  } else {
    ctx.status = 400;
  }
});

ajaxRouter.put(`/cart/shipping_address`, async ctx => {
  const orderId = ctx.cookies.get(`order_id`);
  if (orderId) {
    const cartResponse = await api.orderAddresses.updateShippingAddress(orderId, ctx.request.body);
    const cart = await fillCartItems(cartResponse);
    ctx.body = cart;
    ctx.status = 200;
  } else {
    ctx.status = 400;
    ctx.body = `Bad request`;
  }
});

ajaxRouter.post(`/cart/charge`, async ctx => {
  const orderId = ctx.cookies.get(`order_id`);
  if (orderId) {
    const chargeResponse = await api.orders.chargeOrder(orderId);
    ctx.body = chargeResponse;
    ctx.status = 200;
  } else {
    ctx.status = 400;
    ctx.body = `Bad request`;
  }
});

ajaxRouter.post(`/pages`, async ctx => {
  const pages = await api.pages.getPages(ctx.request.body);
  if (pages.length > 0) {
    ctx.body = pages;
    ctx.status = 200;
    ctx.set(`Cache-Control`, DEFAULT_CACHE_CONTROL);
  } else {
    ctx.body = `Something went wrong, try later or contact with your admin`;
    ctx.status = 400;
  }
});

ajaxRouter.post(`/pages/:id`, async ctx => {
  const page = await api.pages.getSinglePage(utils.getIdByUrl(ctx.url, 1));
  if (page) {
    ctx.body = page;
    ctx.status = 200;
    ctx.set(`Cache-Control`, DEFAULT_CACHE_CONTROL);
  } else {
    ctx.body = `Bad request`;
    ctx.status = 400;
  }
});

ajaxRouter.get(`/pages/:id/image`, async ctx => {
  const image = await api.pages.getCardImage(utils.getIdByUrl(ctx.url, 2));
  if (image) {
    ctx.body = image;
    ctx.status = 200;
    ctx.set(`Cache-Control`, DEFAULT_CACHE_CONTROL);
  } else {
    ctx.body = `Bad request`;
    ctx.status = 400;
  }
});

ajaxRouter.get(`/sitemap`, async ctx => {
  let result = null;
  const filter = ctx.request.body;
  filter.enabled = true;

  const sitemapResponse = await api.sitemap.getPaths(filter);
  if (sitemapResponse.length > 0) {
    result = sitemapResponse;
    if (result.type === `product`) {
      const productResponse = await api.products.getProductList(result);
      result.data = productResponse;
    } else if (result.type === `page`) {
      const pageResponse = await api.pages.getPages(result);
      result.data = pageResponse;
    }
  }
  ctx.status = 200;
  ctx.set(`Cache-Control`, DEFAULT_CACHE_CONTROL);
  ctx.body = result;
});

ajaxRouter.get(`/payment_methods`, async ctx => {
  const filter = {
    enabled: true,
  };
  const paymentMethods = await api.paymentMethods.getMethods(filter);
  ctx.body = paymentMethods;
  ctx.status = 200;
});

ajaxRouter.get(`/shipping_methods`, async ctx => {
  const filter = {
    enabled: true,
  };
  const shippingMethods = await api.shippingMethods.getMethods(filter);

  ctx.body = shippingMethods;
  ctx.status = 200;
});

ajaxRouter.get('/payment_form_settings', async ctx => {
  const orderId = ctx.cookies.get(`order_id`);
  if (orderId) {
    const data = await paymentGateways.getPaymentFormSettings(orderId);
    ctx.body = data;
    ctx.status = 200;
  } else {
    ctx.body = `Something went wrong, please try later or contact with your administrator`;
    ctx.status = 200;
  }
});

export default ajaxRouter;
