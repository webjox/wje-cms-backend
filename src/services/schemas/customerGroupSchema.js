import { Schema } from 'mongoose';

const cutromerGroupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
  },
  { timestamps: true, versionKey: false },
);

export default cutromerGroupSchema;
