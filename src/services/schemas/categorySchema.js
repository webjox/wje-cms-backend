import { Schema } from 'mongoose';

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    meta_description: {
      type: String,
      default: '',
    },
    meta_title: {
      type: String,
      default: '',
    },
    image: {
      type: Object,
      default: {},
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    sort: {
      type: String,
      default: '',
    },
    parent_id: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    position: {
      type: Number,
      default: 0,
    },
    slug: {
      type: String,
      default: '',
    },
  },
  { timestamps: true, versionKey: false },
);

export default categorySchema;
