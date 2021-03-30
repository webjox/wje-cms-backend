import models from '../models';
import {Types} from 'mongoose';
import logger from 'winston';

const orderStatusesModel = models.orderStatusesModel;

class OrderStatusesApi {
    constructor() {}

    async getStatuses(params = {}) {
        const filter = {};
        if(params._id) {
            filter._id = params._id
        }

        return await orderStatusesModel.find(filter);
    }

    async getSinglesStatuses(id) {
        if(!Types.ObjectId.isValid(id)) {
            return 'Invalid identifier'
        }

        return await orderStatusesModel.findById(id);
    }

    async addStatus(data) {
        try {
            return await orderStatusesModel.create(data);
        } catch (error) {
            logger.error(error.toString());
        }
    }

    async updateStatus(id, data) {
        if(!Types.ObjectId.isValid(id)) {
            return 'Invalid identifier'
        }

        try {
            return await orderStatusesModel.findByIdAndUpdate(id, data);
        } catch (error) {
            logger.error(error.toString());
        }
    }

    async deleteStatus(id) {
        if(!Types.ObjectId.isValid(id)) {
            return 'Invalid identifier'
        }

        try {
            return await orderStatusesModel.findByIdAndDelete(id);
        } catch (error) {
            logger.error(error.toString());
        }
    }
}

export default new OrderStatusesApi();