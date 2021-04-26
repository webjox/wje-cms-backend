import { Types } from 'mongoose';
import logger from 'winston';
import models from '../models';

const { CustomerGroupModel } = models;

class CustomerGroupsApi {
  async getGroups() {
    const result = await CustomerGroupModel.find();
    return result;
  }

  async getSingleGroup(id) {
    if (!Types.ObjectId.isValid(id)) return 'Invalid Identifier';
    const result = await CustomerGroupModel.findById(id);
    return result;
  }

  async addGroup(data) {
    try {
      return await CustomerGroupModel.create(data);
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async updateGroup(id, data) {
    if (!Types.ObjectId.isValid(id)) return 'Invalid Identifier';
    try {
      await CustomerGroupModel.findByIdAndUpdate(id, data);
      const result = await this.getSingleGroup(id);
      return result;
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async deleteGroup(id) {
    if (!Types.ObjectId.isValid(id)) return 'Invalid Identifier';
    try {
      return await CustomerGroupModel.findByIdAndDelete(id);
    } catch (error) {
      logger.error(error.toString());
    }
  }
}

export default new CustomerGroupsApi();
