import models from '../models';
import logger from 'winston';
import {Types} from 'mongoose';

const shop = models.shopModel;

class ShopsApi {
    constructor() {}

    async addShop(data = {}) {
        try {
            const result = await shop.create(data);
            logger.info(`Shop ${result.name} was added in db`)
            return result;
        } catch (error) {
            logger.error(error);
        }
    }

    async updateShop(id, data) {
        if(!Types.ObjectId.isValid(id)) {
            return `Invalid identifier`
        }

        try {
            await shop.findByIdAndUpdate(id, data);
            return await shop.findById(id);
        } catch (error) {
            logger.error(error);
        }
    }

    async getShops() {
        return await shop.find({})
    }

    async getShopById(id) {
        if(!Types.ObjectId.isValid(id)) {
            return `Invalid identifier`
        }
        return await shop.findById(id);
    }

    async deleteShop(id) {
        if(!Types.ObjectId.isValid(id)) {
            return `Invalid identifier`
        }
        try {
            // clear all products from this shop
            await models.productModel.updateMany({}, { $pull: { shops: { shop_id: id }}});
            await shop.findByIdAndRemove(id);
            return {status: 'success'} 
        } catch (error) {
            logger.error(error);
        }
    }

}

export default new ShopsApi();