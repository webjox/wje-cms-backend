import { Schema } from 'mongoose';

const variantSchema = new Schema({
  sku: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    default: 0,
  },
  stock_quantity: {
    type: Number,
    default: 0,
  },
  weight: {
    type: Number,
    default: 0,
  },
  options: {
    type: Array,
    default: [],
  },
});

export default variantSchema;
