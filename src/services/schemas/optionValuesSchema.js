import { Schema } from 'mongoose';

const optionValueSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { versionKey: false },
);

export default optionValueSchema;
