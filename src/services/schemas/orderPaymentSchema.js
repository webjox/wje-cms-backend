import { Schema } from 'mongoose';

const orderPaymentSchema = new Schema({
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
        default: false
    },
    conditions: {
        type: Object,
        default: {
            countries: [],
            shipping_method_ids: [],
            subtotal_min: 0,
            subtotal_max: 0
        }
    },
    gateway: {
        type: String,
        default: ''
    }
}, {timestamps: true, versionKey: false})

export default orderPaymentSchema;