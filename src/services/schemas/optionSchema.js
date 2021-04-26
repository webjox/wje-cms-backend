import { Schema } from 'mongoose';

const optionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    control: {
      type: String,
      default: 'select',
    },
    required: {
      type: Boolean,
      default: true,
    },
    position: {
      type: Number,
      default: 0,
    },
    values: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true, versionKey: false },
);

export default optionSchema;
