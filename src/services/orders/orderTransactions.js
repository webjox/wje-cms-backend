import webhooks from '../../libs/webhooks';
import ordersApi from './index';
import { Types } from 'mongoose';
import models from '../models';

const orderTransactionModel = models.orderTransactionModel;

class OrderTransactionsApi {
    constructor() {}

    async addTransaction(order_id, data) {
        if(!Types.ObjectId.isValid(order_id)) {
            return `Invalid identifier`
        }

        const transaction = new orderTransactionModel(data);
        const order = await ordersApi.updateOrder(order_id, {$push: {
            transactions: transaction
        }});
        await webhooks.trigger({
            event: webhooks.events.TRANSACTION_CREATED,
            payload: order
        });
        return order;
    }

    async updateTransaction(order_id, transaction_id, data) {
        if(!Types.ObjectId.isValid(order_id) && !Types.ObjectId.isValid(transaction_id)) {
            return `Invalid identifier`
        }

        const order = await ordersApi.getSingleOrder(order_id);
        if(order.transactions) {
            order.transcations.map(item => {
                if(item._id === transaction_id) {
                    Object.assign(item, data);
                }
            })
        }

        const updatedOrder = await ordersApi.updateOrder(order_id, {
            transactions: order.transcations
        })
		await webhooks.trigger({
			event: webhooks.events.TRANSACTION_UPDATED,
			payload: updatedOrder
		});
		return updatedOrder;
    }
    async deleteTransaction(order_id, transaction_id) {
        if(!Types.ObjectId.isValid(order_id) && !Types.ObjectId.isValid(transaction_id)) {
            return `Invalid identifier`
        }

        const order = await ordersApi.updateOrder(order_id,
             { $pull : { transactions: { _id: transaction_id }}}
        )
        await webhooks.trigger({
			event: webhooks.events.TRANSACTION_DELETED,
			payload: order
		});
		return order;
    }
}

export default new OrderTransactionsApi();