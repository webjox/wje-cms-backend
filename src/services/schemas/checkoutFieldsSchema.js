import { Schema } from 'mongoose';

const checkoutFieldsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    status: String,
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  { versionKey: false },
);

export default checkoutFieldsSchema;
