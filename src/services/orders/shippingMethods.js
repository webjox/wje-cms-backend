import { Types } from 'mongoose';
import logger from 'winston';
import models from '../models';

const { OrderShippingModel } = models;

class ShippingMethodsApi {
  async createMethod(data) {
    try {
      const result = await OrderShippingModel.create(data);
      if (result) return result;
    } catch (error) {
      logger.error(error);
      return { status: 'failure', error };
    }
  }

  async getMethodById(id) {
    if (!Types.ObjectId.isValid(id)) {
      return `Invalid identifier`;
    }

    const result = await OrderShippingModel.findById(id);
    if (result) return result;
    return `Payment method not found`;
  }

  async getMethods(filter = {}) {
    const result = await OrderShippingModel.find(filter);
    if (result.length > 0) return result;
    return `Payment methods not found`;
  }

  async updateMethod(id, data) {
    if (!Types.ObjectId.isValid(id)) {
      return `Invalid identifier`;
    }

    try {
      await OrderShippingModel.findByIdAndUpdate(id, data);
      const result = await this.getMethodById(id);
      return result;
    } catch (error) {
      return { status: 'failure', error };
    }
  }

  async deleteMethod(id) {
    if (!Types.ObjectId.isValid(id)) {
      return `Invalid identifier`;
    }

    try {
      await OrderShippingModel.findByIdAndDelete(id);
      return { status: 'success' };
    } catch (error) {
      logger.error(error);
      return { status: 'failure', error };
    }
  }
}

export default new ShippingMethodsApi();
