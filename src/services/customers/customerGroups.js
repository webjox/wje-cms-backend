import models from '../models';
import { Types } from 'mongoose';
import logger from 'winston';

const customerGroupModel = models.customerGroupModel;

class CustomerGroupsApi {
    constructor() {}
    
    async getGroups() {
        return await customerGroupModel.find();
    }

    async getSingleGroup(id) {
        if(!Types.ObjectId.isValid(id)) return 'Invalid Identifier';
        return await customerGroupModel.findById(id);
    }

    async addGroup(data) {
        try {
            return await customerGroupModel.create(data);   
        } catch (error) {
            logger.error(error.toString());
        }
    }

    async updateGroup(id, data) {
        if(!Types.ObjectId.isValid(id)) return 'Invalid Identifier';
        try {
            return await customerGroupModel.findByIdAndUpdate(id, data);   
        } catch (error) {
            logger.error(error.toString());
        }
    }

    async deleteGroup(id) {
        if(!Types.ObjectId.isValid(id)) return 'Invalid Identifier';
        try {
            return await customerGroupModel.findByIdAndDelete(id);   
        } catch (error) {
            logger.error(error.toString());
        }
    }
}

export default new CustomerGroupsApi();