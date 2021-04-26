import { Schema } from 'mongoose';

const orderItemSchema = new Schema(
  {
    product_image: {
      type: Array,
    },
    product_id: Schema.Types.ObjectId,
    variant_id: Schema.Types.ObjectId,
    quantity: {
      type: Number,
      min: 1,
    },
    custom_price: {
      type: Number,
      min: 0,
    },
    custom_note: String,
    sku: String,
    name: String,
    variant_name: String,
    stock_price: Number,
    price: Number,
    tax_class: String,
    weight: Number,
    discount_total: Number,
    stock_price_total: Number,
    price_total: Number,
  },
  { versionKey: false },
);

export default orderItemSchema;
