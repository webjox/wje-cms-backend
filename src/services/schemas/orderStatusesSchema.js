import { Schema } from 'mongoose';

const orderStatusesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
    bgcolor: {
      type: String,
      default: '',
    },
    is_public: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export default orderStatusesSchema;
