import { Types } from 'mongoose';
import parse from '../../libs/parse';
import ordersApi from './index';
import logger from 'winston';

class OrderAddressApi {
    constructor() {}

    async updateShippingAddress(id, data) {
        if(!Types.ObjectId.isValid(id)) {
            return `Invalid identifier`;
        }

        const shipping_address = this.getValidDocumentForUpdate(data, `shipping_address`);
        return await ordersApi.updateOrder(id, {$set: shipping_address});
    }
    
    getValidDocumentForUpdate(data, addressTypeName) {
		const keys = Object.keys(data);
		if (keys.length === 0) {
			return new Error('Required fields are missing');
		}

		let address = {};

		keys.forEach(key => {
			const value = data[key];
			if (key === 'coordinates' || key === 'details') {
				address[`${addressTypeName}.${key}`] = value;
			} else {
				address[`${addressTypeName}.${key}`] = parse.getString(value);
			}
		});

		return address;
	}
}

export default new OrderAddressApi();