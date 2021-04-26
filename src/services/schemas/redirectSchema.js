import { Schema } from 'mongoose';

const redirectSchema = new Schema(
  {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      default: 301,
    },
  },
  { versionKey: false },
);

export default redirectSchema;
