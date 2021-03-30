import {Schema} from 'mongoose';

const shopSchema = new Schema({
    name: {
        type: String,
        default: 'Default shop'
    },
    location: {
        type: Object,
        default: {
            coords: {
                lat: 0,
                lng: 0
            }, 
            full_address: 'Default address'
        }
    },
    work_time: {
        type: Object,
        default: {
            from: 0,
            to: 0
        }
    }
}, {timestamps: true, versionKey: false})

export default shopSchema;