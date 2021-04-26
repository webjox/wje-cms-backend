import { Schema } from 'mongoose';

const paymentGatewaySchema = new Schema(
  {
    name: {
      type: String,
      default: 'Default gateway',
    },
    gateway: {
      type: Object,
      default: {},
    },
    online_payment: {
      type: Boolean,
      default: false,
    },
    enabled: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false },
);

export default paymentGatewaySchema;
