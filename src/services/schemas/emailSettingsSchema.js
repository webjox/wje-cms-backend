import { Schema } from 'mongoose';

const emailSettingsSchema = new Schema(
  {
    host: {
      type: String,
      default: '',
    },
    port: {
      type: Number,
      default: 0,
      min: 0,
    },
    user: {
      type: String,
      default: '',
    },
    pass: {
      type: String,
      default: '',
    },
    from_name: {
      type: String,
      default: '',
    },
    from_address: {
      type: String,
      default: '',
    },
  },
  { versionKey: false },
);

export default emailSettingsSchema;
