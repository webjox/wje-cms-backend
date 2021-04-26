import { Schema } from 'mongoose';

const pageSchema = new Schema({
  is_system: {
    type: Boolean,
    default: false,
  },
  in_the_sidebar: {
    type: Boolean,
    default: false,
  },
  content: {
    type: String,
    default: '',
  },
  card_name: {
    type: String,
    default: '',
  },
  card_image: {
    type: Object,
    default: {},
  },
  meta_description: String,
  meta_title: String,
  enabled: {
    type: Boolean,
    default: true,
  },
  tags: {
    type: Array,
    default: [],
  },
  slug: {
    type: String,
    required: true,
  },
});

export default pageSchema;
