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
import paymentGatewaySchema from './schemas/paymentGatewaySchema';
import pageSchema from './schemas/pageSchema';
import redirectSchema from './schemas/redirectSchema';
import checkoutFieldsSchema from './schemas/checkoutFieldsSchema';
import commerceSettingsSchema from './schemas/commerceSettingsSchema';
import productTagSchema from './schemas/productTagSchema';
import shopSchema from './schemas/shopSchema';
import {model} from 'mongoose';

export default {
    productModel: model('products', productSchema),
    categoryModel: model('categories', categorySchema),
    optionModel: model('product_options', optionSchema),
    optionValueModel: model('product_optionValues', optionValuesSchema),
    orderModel: model('orders', orderSchema),
    settingModel: model('settings', settingsSchema),
    variantModel: model('product_variants', variantSchema),
    customerModel: model('customers', customerSchema),
    webhookModel: model('webhooks', webhookSchema),
    customerGroupModel: model('customerGrops', customerGroupSchema),
    customerAddressesModel: model('customerAddresses', customerAddressesSchema),
    orderStatusesModel: model('orderStatuses', orderStatusesSchema),
    orderShippingModel: model('shippingMethods', orderShippingSchema),
    orderPaymentModel: model('paymentMethods', orderPaymentSchema),
    orderItemModel: model('orderItems', orderItemSchema),
    orderDiscountModel: model('orderDiscount', orderDiscountSchema),
    orderTransactionModel: model(`orderTransactions`, orderTransactionSchema),
    emailSettingsModel: model('emailSettings', emailSettingsSchema),
    emailTemplatesModel: model('emailTemplates', emailTemplatesSchema),
    tokenModel: model('tokens', tokenSchema),
    paymentGatewayModel: model('paymentGateway', paymentGatewaySchema),
    pageModel: model(`pages`, pageSchema),
    redirectModel: model(`redirects`, redirectSchema),
    checkoutFieldsModel: model('checkoutFields', checkoutFieldsSchema),
    commerceSettingsModel: model('commerceSettings', commerceSettingsSchema),
    productTagModel: model('productTags', productTagSchema),
    shopModel: model('shops', shopSchema)
}