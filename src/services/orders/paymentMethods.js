import { Types } from 'mongoose';
import logger from 'winston';
import models from '../models';

const paymentModel = models.PaymentMethods;

class PaymentMethodsApi {
  async createMethod(data) {
    try {
      const result = await paymentModel.create(data);
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

    const result = await paymentModel.findById(id);
    if (result) return result;
    return `Payment method not found`;
  }

  async getMethods(filter = {}) {
    const result = await paymentModel.find(filter);
    if (result.length > 0) return result;
    return `Payment methods not found`;
  }

  async updateMethod(id, data) {
    if (!Types.ObjectId.isValid(id)) {
      return `Invalid identifier`;
    }

    try {
      await paymentModel.findByIdAndUpdate(id, data);
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
      await paymentModel.findByIdAndDelete(id);
      return { status: 'success' };
    } catch (error) {
      logger.error(error);
      return { status: 'failure', error };
    }
  }
}

export default new PaymentMethodsApi();
