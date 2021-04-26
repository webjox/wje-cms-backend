import { Schema } from 'mongoose';

const orderShippingSchema = new Schema(
  {
    name: {
      type: String,
      default: 'Default shipping method',
    },
    description: {
      type: String,
      default: '',
    },
    position: {
      type: Number,
      default: 0,
    },
    enabled: {
      type: Boolean,
      default: false,
    },
    delivery_time: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true, versionKey: false },
);

export default orderShippingSchema;
