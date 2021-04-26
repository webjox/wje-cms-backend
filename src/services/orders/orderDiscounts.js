import { Types } from 'mongoose';
import logger from 'winston';
import ordersApi from './index';
import models from '../models';

const { OrderDiscountModel } = models;

class OrderDiscountsApi {
  async addDiscount(orderId, data) {
    if (!Types.ObjectId.isValid(orderId)) {
      return `Invalid identifier`;
    }
    try {
      const discountItem = new OrderDiscountModel(data);
      return await ordersApi.updateOrder(orderId, {
        $push: {
          discounts: discountItem,
        },
      });
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async updateDiscount(orderId, discountId, data) {
    if (!Types.ObjectId.isValid(orderId) || !Types.ObjectId.isValid(discountId)) {
      return `Invalid identifier`;
    }
    const newItem = new OrderDiscountModel(data);
    delete newItem._id;

    const order = await ordersApi.getSingleOrder(orderId);
    if (order.discounts) {
      order.discounts.map(item => {
        if (item._id.equals(discountId)) {
          Object.assign(item, newItem);
        }
      });

      try {
        return await ordersApi.updateOrder(orderId, {
          discounts: order.discounts,
        });
      } catch (error) {
        logger.error(error.toString());
      }
    } else return null;
  }

  async deleteDiscount(orderId, discountId) {
    if (!Types.ObjectID.isValid(orderId) || !Types.ObjectID.isValid(discountId)) {
      return 'Invalid identifier';
    }
    try {
      return await ordersApi.updateOrder(orderId, {
        $pull: { discounts: { _id: discountId } },
      });
    } catch (error) {
      logger.error(error.toString());
    }
  }
}

export default new OrderDiscountsApi();
