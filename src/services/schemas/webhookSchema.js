import { Schema } from 'mongoose';

const webhookSchema = new Schema(
  {
    description: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
    secret: {
      type: String,
      default: '',
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    events: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true, versionKey: false },
);

export default webhookSchema;
