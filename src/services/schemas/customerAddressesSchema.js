import { Schema } from 'mongoose';

const customerAddressesSchema = new Schema(
  {
    address: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
      index: true,
    },
    country: {
      type: String,
      default: 'Russia',
      uppercase: true,
    },
    state: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    postal_code: {
      type: String,
      default: '',
    },
    full_name: {
      type: String,
      default: '',
    },
    company: {
      type: String,
      default: '',
    },
    tax_number: {
      type: String,
      default: '',
    },
    coordinates: {
      type: Object,
      default: null,
    },
    details: {
      type: Object,
      defautl: null,
    },
  },
  { timestamps: true, versionKey: false },
);

export default customerAddressesSchema;
