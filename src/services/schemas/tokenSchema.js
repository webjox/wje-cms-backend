import { Schema } from 'mongoose';

const tokenSchema = new Schema(
  {
    is_revoked: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
      lowercase: true,
    },
    scopes: {
      type: Array,
      default: [],
    },
    expiration: {
      type: Number,
      default: 10000,
      min: 0,
    },
  },
  { timestamps: true, versionKey: false },
);

export default tokenSchema;
