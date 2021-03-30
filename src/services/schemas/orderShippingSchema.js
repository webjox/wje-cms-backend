import { Schema } from 'mongoose';

const orderShippingSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    position: {
        type: Number
    },
    enabled: {
        type: Boolean,
        default: true
    },
    price: {
        type: Number,
        default: 0,
        min: 0
    },
    conditions: {
        type: Object,
        default: {
            countries: [],
            states: [],
            cities: [],
            subtotal_min: 0,
            subtotal_max: 0,
            weight_total_min: 0,
            weight_total_max: 0
        }
    },
    fields: {
        type: Array,
        default: []
    }
}, {timestamps: true, versionKey: false})

export default orderShippingSchema;