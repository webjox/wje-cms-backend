import { model } from 'mongoose';
import productSchema from './schemas/productSchema';
import categorySchema from './schemas/categorySchema';
import optionSchema from './schemas/optionSchema';
import optionValuesSchema from './schemas/optionValuesSchema';
import orderSchema from './schemas/orderSchema';
import orderStatusesSchema from './schemas/orderStatusesSchema';
import orderShippingSchema from './schemas/orderShippingSchema';
import orderPaymentSchema from './schemas/orderPaymentSchema';
import orderItemSchema from './schemas/orderItemSchema';
import orderTransactionSchema from './schemas/orderTransactionSchema';
import orderDiscountSchema from './schemas/orderDiscountSchema';
import settingsSchema from './schemas/settingsSchema';
import variantSchema from './schemas/variantSchema';
import customerSchema from './schemas/customerSchema';
import customerGroupSchema from './schemas/customerGroupSchema';
import customerAddressesSchema from './schemas/customerAddressesSchema';
import webhookSchema from './schemas/webhookSchema';
import emailSettingsSchema from './schemas/emailSettingsSchema';
import emailTemplatesSchema from './schemas/emailTemplatesSchema';
import tokenSchema from './schemas/tokenSchema';
import pageSchema from './schemas/pageSchema';
import redirectSchema from './schemas/redirectSchema';
import checkoutFieldsSchema from './schemas/checkoutFieldsSchema';
import commerceSettingsSchema from './schemas/commerceSettingsSchema';
import productTagSchema from './schemas/productTagSchema';
import shopSchema from './schemas/shopSchema';

export default {
  ProductModel: model('products', productSchema),
  CategoryModel: model('categories', categorySchema),
  OptionModel: model('product_options', optionSchema),
  OptionValueModel: model('product_optionValues', optionValuesSchema),
  OrderModel: model('orders', orderSchema),
  SettingModel: model('settings', settingsSchema),
  VariantModel: model('product_variants', variantSchema),
  CustomerModel: model('customers', customerSchema),
  WebhookModel: model('webhooks', webhookSchema),
  CustomerGroupModel: model('customerGroups', customerGroupSchema),
  CustomerAddressesModel: model('customerAddresses', customerAddressesSchema),
  OrderStatusesModel: model('orderStatuses', orderStatusesSchema),
  OrderShippingModel: model('shippingMethods', orderShippingSchema),
  PaymentMethods: model('paymentMethods', orderPaymentSchema),
  OrderItemModel: model('orderItems', orderItemSchema),
  OrderDiscountModel: model('orderDiscount', orderDiscountSchema),
  OrderTransactionModel: model(`orderTransactions`, orderTransactionSchema),
  EmailSettingsModel: model('emailSettings', emailSettingsSchema),
  EmailTemplatesModel: model('emailTemplates', emailTemplatesSchema),
  TokenModel: model('tokens', tokenSchema),
  PageModel: model(`pages`, pageSchema),
  RedirectModel: model(`redirects`, redirectSchema),
  CheckoutFieldsModel: model('checkoutFields', checkoutFieldsSchema),
  CommerceSettingsModel: model('commerceSettings', commerceSettingsSchema),
  ProductTagModel: model('productTags', productTagSchema),
  ShopModel: model('shops', shopSchema),
};
