import { Schema } from 'mongoose';

const productSchema = new Schema(
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
    tags: {
      type: Array,
      default: [],
      index: true,
    },
    attributes: {
      type: Array,
      default: [],
    },
    enabled: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      default: '',
      required: true,
      unique: true,
    },
    sku: {
      type: String,
      default: '',
    },
    related_products_ids: {
      type: Array,
      default: [],
    },
    price: {
      type: Number,
      default: 0,
      index: true,
    },
    variants: {
      type: Array,
      default: [],
    },
    stock_price: {
      type: Number,
      default: 0,
      index: true,
    },
    stock_tracking: {
      type: Boolean,
      default: true,
    },
    stock_backorder: {
      type: Boolean,
      default: true,
    },
    quantity_inc: {
      type: Number,
      default: 1,
    },
    quantity_min: {
      type: Number,
      default: 1,
    },
    weight: {
      type: String,
      default: 0,
    },
    shops: {
      type: Array,
      default: [],
    },
    position: {
      type: Number,
      default: 0,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    category_ids: {
      type: Array,
      default: [],
    },
    images: {
      type: Array,
      default: [],
    },
    files: {
      type: Array,
      default: [],
    },
    video: {
      type: String,
      default: null,
    },
    options: {
      type: Array,
      default: [],
    },
    manufacturer: {
      type: String,
      default: '',
    },
    package_quantity: {
      type: Number,
      default: 1,
    },
    effects: {
      type: Array,
      default: [],
    },
    volleys: {
      type: Number,
      index: true,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false },
);

productSchema.index({ name: 'text', sku: 'text', description: 'text' });

export default productSchema;
