import { Schema } from 'mongoose';

const paymentGatewaySchema = new Schema({
    name: {
        type: String,
        default: ''
    },
    gateway: {
        type: Object,
        default: {}
    }
}, {versionKey: false})

export default paymentGatewaySchema;