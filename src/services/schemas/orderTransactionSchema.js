import { Schema } from 'mongoose';

const orderTransactionSchema = new Schema(
  {
    transaction_id: {
      type: String,
      default: '',
    },
    amount: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: 'rub',
    },
    status: String,
    details: String,
    success: Boolean,
  },
  { versionKey: false },
);

export default orderTransactionSchema;
