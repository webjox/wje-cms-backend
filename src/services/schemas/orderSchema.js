import { Schema } from 'mongoose';

const orderSchema = new Schema(
  {
    date_placed: {
      type: Date,
      default: null,
    },
    date_closed: {
      type: Date,
      default: null,
    },
    date_paid: {
      type: Date,
      default: null,
    },
    date_cancelled: {
      type: Date,
      default: null,
    },
    number: {
      type: Number,
      required: true,
      unique: true,
    },
    shipping_status: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      default: [],
    },
    transactions: {
      type: Array,
      default: [],
    },
    discounts: {
      type: Array,
      default: [],
    },
    shipping_address: {
      type: Object,
      default: {
        full_name: '',
        address: '',
        city: '',
        country: '',
        postal_code: '',
        state: '',
        phone: '',
        company: '',
        tax_number: '',
        coordinates: {
          latitude: '',
          longtitude: '',
        },
        details: null,
      },
    },
    tax_rate: {
      type: Number,
      default: 0,
    },
    shipping_tax: {
      type: Number,
      default: 0,
    },
    shipping_discount: {
      type: Number,
      default: 0,
    },
    shipping_price: {
      type: Number,
      default: 0,
    },
    item_tax_included: {
      type: Boolean,
      default: true,
    },
    shipping_tax_included: {
      type: Boolean,
      default: true,
    },
    closed: {
      type: Boolean,
      default: false,
    },
    cancelled: {
      type: Boolean,
      default: false,
    },
    delivered: {
      type: Boolean,
      default: false,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    hold: {
      type: Boolean,
      default: false,
    },
    draft: {
      type: Boolean,
      default: true,
    },
    full_name: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    mobile: {
      type: String,
      default: '',
    },
    referrer_url: {
      type: String,
      default: '',
    },
    landing_url: {
      type: String,
      default: '',
    },
    channel: {
      type: String,
      default: '',
    },
    note: {
      type: String,
      default: '',
    },
    comments: {
      type: String,
      default: '',
    },
    coupon: {
      type: String,
      default: '',
    },
    tracking_number: {
      type: String,
      default: '',
    },
    customer_id: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    status_id: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    payment_method_id: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    shipping_method_id: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    tags: {
      type: Array,
      default: [],
    },
    browser: {
      type: Object,
      default: {
        ip: '',
        user_agent: '',
      },
    },
  },
  { timestamps: true, versionKey: false },
);

export default orderSchema;
