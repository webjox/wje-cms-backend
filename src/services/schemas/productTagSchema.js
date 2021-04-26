import { Schema } from 'mongoose';

const productTagSchema = new Schema(
  {
    name: {
      type: String,
      default: 0,
    },
    position: {
      type: Number,
      default: 0,
    },
  },
  { versionKey: false, timestamps: true },
);

export default productTagSchema;
