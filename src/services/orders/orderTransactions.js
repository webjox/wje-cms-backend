import { Types } from 'mongoose';
import webhooks from '../../libs/webhooks';
import ordersApi from './index';
import models from '../models';

const { OrderTransactionModel } = models;

class OrderTransactionsApi {
  async addTransaction(orderId, data) {
    if (!Types.ObjectId.isValid(orderId)) {
      return `Invalid identifier`;
    }

    const transaction = new OrderTransactionModel(data);
    const order = await ordersApi.updateOrder(orderId, {
      $push: {
        transactions: transaction,
      },
    });
    await webhooks.trigger({
      event: webhooks.events.TRANSACTION_CREATED,
      payload: order,
    });
    return order;
  }

  async updateTransaction(orderId, transactionId, data) {
    if (!Types.ObjectId.isValid(orderId) && !Types.ObjectId.isValid(transactionId)) {
      return `Invalid identifier`;
    }

    const order = await ordersApi.getSingleOrder(orderId);
    if (order.transactions) {
      order.transcations.map(item => {
        if (item._id === transactionId) {
          Object.assign(item, data);
        }
      });
    }

    const updatedOrder = await ordersApi.updateOrder(orderId, {
      transactions: order.transcations,
    });
    await webhooks.trigger({
      event: webhooks.events.TRANSACTION_UPDATED,
      payload: updatedOrder,
    });
    return updatedOrder;
  }

  async deleteTransaction(orderId, transactionId) {
    if (!Types.ObjectId.isValid(orderId) && !Types.ObjectId.isValid(transactionId)) {
      return `Invalid identifier`;
    }

    const order = await ordersApi.updateOrder(orderId, {
      $pull: { transactions: { _id: transactionId } },
    });
    await webhooks.trigger({
      event: webhooks.events.TRANSACTION_DELETED,
      payload: order,
    });
    return order;
  }
}

export default new OrderTransactionsApi();
