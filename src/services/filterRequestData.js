import bcrypt from 'bcrypt';
import config from '../../config';

const { saltRounds } = config;

export default class FilterRequestData {
  static filterData(object, type) {
    const returnObject = {};
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
      if (object.featured_products !== undefined)
        returnObject.featured_products = [object.featured_products];
      return returnObject;
    }
  }
}
