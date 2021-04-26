import { Types } from 'mongoose';
import logger from 'winston';
import models from '../models';

const { OrderStatusesModel } = models;

class OrderStatusesApi {
  async getStatuses(params = {}) {
    const filter = {};
    if (params._id) {
      filter._id = params._id;
    }

    const result = await OrderStatusesModel.find(filter);
    return result;
  }

  async getSinglesStatuses(id) {
    if (!Types.ObjectId.isValid(id)) {
      return 'Invalid identifier';
    }

    const result = await OrderStatusesModel.findById(id);
    return result;
  }

  async addStatus(data) {
    try {
      return await OrderStatusesModel.create(data);
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async updateStatus(id, data) {
    if (!Types.ObjectId.isValid(id)) {
      return 'Invalid identifier';
    }

    try {
      return await OrderStatusesModel.findByIdAndUpdate(id, data);
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async deleteStatus(id) {
    if (!Types.ObjectId.isValid(id)) {
      return 'Invalid identifier';
    }

    try {
      return await OrderStatusesModel.findByIdAndDelete(id);
    } catch (error) {
      logger.error(error.toString());
    }
  }
}

export default new OrderStatusesApi();
