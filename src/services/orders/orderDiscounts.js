import { Types } from 'mongoose';
import ordersApi from './index';
import models from '../models';

const orderDiscountModel = models.orderDiscountModel;

class OrderDiscountsApi {
    constructor() {}

    async addDiscount(order_id, data) {
        if(!Types.ObjectId.isValid(order_id)) {
            return `Invalid identifier`
        }
        try {
            const discountItem = new orderDiscountModel(data);
            return await ordersApi.updateOrder(order_id, {$push: {
                discounts: discountItem
            }});   
        } catch (error) {}
    }

    async updateDiscount(order_id, discount_id, data) {
        if(!Types.ObjectId.isValid(order_id) || !Types.ObjectId.isValid(discount_id)) {
            return `Invalid identifier`
        }
        const newItem = new orderDiscountModel(data);
        delete newItem._id;

        const order = await ordersApi.getSingleOrder(order_id);
        if(order.discounts) {
            order.discounts.map(item => {
                if(item._id.equals(discount_id)) {
                    Object.assign(item, newItem);
                }
            })

            try {
                return await ordersApi.updateOrder(order_id, {
                    discounts: order.discounts
                }) 
            } catch (error) {}
        } else return null;
    }

    async deleteDiscount(order_id, discount_id) {
		if (!Types.ObjectID.isValid(order_id) || !Types.ObjectID.isValid(discount_id)) {
			return 'Invalid identifier';
		}
        try {
            return await ordersApi.updateOrder(order_id, {
                $pull: { discounts: { _id: discount_id }}
            })
        } catch (error) {}
	}
}

export default new OrderDiscountsApi();