import { Schema } from 'mongoose';

const settingsSchema = new Schema(
  {
    store_name: {
      type: String,
      default: '',
    },
    domain: {
      type: String,
      defaut: '',
    },
    logo_file: {
      type: String,
      default: 'logo.png',
    },
    language: {
      type: String,
      default: 'ru',
    },
    currency_code: {
      type: String,
      default: 'RUB',
    },
    currency_symbol: {
      type: String,
      default: '₽',
    },
    currency_format: {
      type: String,
      default: '${amount}',
    },
    thousand_separator: {
      type: String,
      default: ',',
    },
    decimal_separator: {
      type: String,
      default: '.',
    },
    decimal_number: {
      type: Number,
      default: 2,
    },
    timezone: {
      type: String,
      default: 'Europe/Moscow',
    },
    date_format: {
      type: String,
      default: 'D MMMM, YYYY',
    },
    time_format: {
      type: String,
      default: 'h:mm a',
    },
    default_shipping_country: {
      type: String,
      default: '',
    },
    default_shipping_state: {
      type: String,
      default: '',
    },
    default_shipping_city: {
      type: String,
      default: '',
    },
    default_product_sorting: {
      type: String,
      default: 'stock_status,price,position',
    },
    product_fields: {
      type: String,
      default:
        'path,id,name,category_id,category_name,sku,images,enabled,discontinued,stock_status,stock_quantity,price,on_sale,regular_price,attributes,tags,position',
    },
    product_limit: {
      type: Number,
      default: 30,
    },
    weight_unit: {
      type: String,
      default: 'kg',
    },
    length_unit: {
      type: String,
      default: 'cm',
    },
    hide_billing_address: {
      type: Boolean,
      default: false,
    },
    order_confirmation_copy_to: {
      type: String,
      default: '',
    },
  },
  { versionKey: false },
);

export default settingsSchema;
