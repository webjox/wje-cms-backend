import models from '../models';
import ordersApi from './index';
import parse from '../../libs/parse';
import { Types } from 'mongoose';

const paymentModel = models.orderPaymentModel;

class PaymentMethodsApi {
    constructor() {}

    async getFilter(params = {}) {
        const filter = {};
        const enabled = parse.getBooleanIfValid(params.enabled);

        if(Types.ObjectId.isValid(params._id)) {
            filter._id = params._id
        }

        if(enabled !== null) {
            filter.enabled = enabled;
        }

        if(Types.ObjectId.isValid(params.order_id)) {
            const order = await ordersApi.getSingleOrder(params.order_id);
            if(order) {
                const shippingMethodObjectID = Types.ObjectId.isValid(order.shipping_method_id) ? order.shipping_method_id : null;

                filter['$and'] = [];
                filter['$and'].push({
                    $or: [
                        { 'conditions.subtotal_min': 0 },
                        { 'conditions.subtotal_min': { $lte: order.subtotal }}
                    ]
                });
                filter['$and'].push({
                    $or: [
                        { 'conditions.subtotal_max': 0 },
                        { 'conditions.subtotal_max': { $gte: order.subtotal }}
                    ]
                });

                if (order.shipping_address.country && order.shipping_address.country.length > 0) {
                    filter['$and'].push({
                        $or: [
                            { 'conditions.countries': { $size: 0 }},
                            { 'conditions.countries': order.shipping_address.country }]
                    });
                }

                if (shippingMethodObjectID) {
                    filter['$and'].push({
                        $or: [
                            { 'conditions.shipping_method_ids': { $size: 0 }},
                            { 'conditions.shipping_method_ids': shippingMethodObjectID }
                        ]
                    });
                }
            }
        }
        return filter;
    }



    async getMethods(params = {}) {
        return await paymentModel.find(await this.getFilter(params));
    }

    async getSingleMethod(id) {
        if(!Types.ObjectId.isValid(id)) {
            return `Invalid identifier`
        }

        return await paymentModel.findById(id);
    }

    async addMethod(data) {
        try {
            return await paymentModel.create(data);   
        } catch (error) {
            return error
        }
    }

    async updateMethod(id, data) {
        if(!Types.ObjectId.isValid(id)) {
            return `Invalid identifier`
        }

        return await paymentModel.findByIdAndUpdate(id, data);
    }

    async deleteMethod(id) {
        if(!Types.ObjectId.isValid(id)) {
            return `Invalid identifier`
        }
        return await paymentModel.findByIdAndDelete(id);
    }

    async pullShippingMethod(id) {
        if(!Types.ObjectId.isValid(id)) {
            return `Invalid identifier`
        }

        return await paymentModel.updateMany({}, { $pull: { 'conditions.shipping_method_ids': id}}, {multi: true});
    }

    async getPaymentMethodConditions(conditions) {
        const methodIds = conditions ? 
            parse.getArrayIfValid(conditions.shipping_method_ids) || [] : [];
        
            return conditions ?
            {
                countries: parse.getArrayIfValid(conditions.countries) || [],
                shipping_method_ids: methodIds,
                subtotal_min: parse.getNumberIfPositive(conditions.subtotal_min) || 0,
                subtotal_max: parse.getNumberIfPositive(conditions.subtotal_max) || 0
            } : {
                countries: [],
                shipping_method_ids: [],
                subtotal_min: 0,
                subtotal_max: 0
            };
    }
} 

export default new PaymentMethodsApi()