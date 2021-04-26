import { Types } from 'mongoose';
import ordersApi from './index';

class OrderAddressApi {
  async updateShippingAddress(id, data) {
    if (!Types.ObjectId.isValid(id)) {
      return `Invalid identifier`;
    }

    const result = await ordersApi.updateOrder(id, { $set: data });
    return result;
  }
}

export default new OrderAddressApi();
