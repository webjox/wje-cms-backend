import { Schema } from 'mongoose';

const shopSchema = new Schema(
  {
    name: {
      type: String,
      default: 'Default shop',
    },
    location: {
      type: Object,
      default: {
        coords: {
          lat: 0,
          lng: 0,
        },
        full_address: 'Default address',
      },
    },
    phone: String,
    description: String,
    work_time: String,
    image: {
      type: Object,
      default: null,
    },
    warehouse: {
      type: Boolean,
      default: false,
    },
    video: String,
  },
  { timestamps: true, versionKey: false },
);

export default shopSchema;
