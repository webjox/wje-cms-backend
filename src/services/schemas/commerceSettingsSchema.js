import { Schema } from 'mongoose';

const commerceSettingsSchema = new Schema(
  {
    status: {
      type: String,
      default: '',
    },
    serviceOptions: {
      type: String,
      default: '',
    },
    deliveryRadius: {
      type: String,
      default: '',
    },
  },
  { versionKey: false },
);

export default commerceSettingsSchema;
