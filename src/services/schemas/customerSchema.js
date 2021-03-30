import { Schema } from 'mongoose';

const customerSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    entity: {
        type: Boolean,
        default: false
    },
    wholesaler: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    total_spent: {
        type: Number,
        default: 0
    },
    orders_count: {
        type: Number,
        default: 0
    },
    loved_items: {
        type: Array,
        default: []
    },
    note: {
        type: String,
        default: ''
    },
    mobile: {
        type: String,
        default: '+70000000000'
    },
    full_name: {
        type: String,
        default: ''
    },
    first_name: {
        type: String,
        default: ''
    },
    last_name: {
        type: String,
        default: ''
    },
    third_name: {
        type: String,
        default: ''
    },
    gender: {
        type: String,
        default: ''
    },
    group_id: {
        type: Schema.Types.ObjectId,
        default: null
    },
    tags: {
        type: Array,
        default: []
    },
    social_accounts: {
        type: Array,
        default: []
    },
    birthdate: {
        type: Date,
        default: null
    },
    shipping_address: {
        type: Object,
        default: {
            address: "",
            city: "",
            state: "",
            country: "",
            postal_code: ""
        }
    },
    browser: {
        type: Object,
        default: {}
    },
    scopes: {
        type: Array,
        default: []
    },
    year_spent: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    }
}, {timestamps: true, versionKey: false})

export default customerSchema;