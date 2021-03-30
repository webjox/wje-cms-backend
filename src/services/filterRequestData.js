import config from '../../config';
import bcrypt from 'bcrypt';

const { saltRounds } = config;

export default class FilterRequestData {
	static filterData(object, type) {
		let returnObject = {};
		if (type === 'customer') {
			if (object.first_name) returnObject.first_name = object.first_name;
			if (object.last_name) returnObject.last_name = object.last_name;
			if (object.first_name && object.last_name)
				returnObject.full_name = `${object.first_name} ${object.last_name}`;
			if (object.email) returnObject.email = object.email.toLowerCase();
			if (object.password) {
				const inputPassword = object.password;
				const salt = bcrypt.genSaltSync(saltRounds);
				returnObject.password = bcrypt.hashSync(inputPassword, salt);
			}
			if (object.shipping_address) returnObject.shipping_address = object.shipping_address;
			if (object.loved_items !== undefined)
				returnObject.loved_items = [object.loved_items];
			return returnObject;
		}
	}
}