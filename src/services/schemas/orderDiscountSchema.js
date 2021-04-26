import { Schema } from 'mongoose';

const orderDiscountSchema = new Schema(
  {
    name: String,
    amount: {
      type: Number,
      min: 0,
    },
  },
  { versionKey: false },
);

export default orderDiscountSchema;
