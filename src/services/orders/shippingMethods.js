import parse from "../../libs/parse";
import models from '../models';
import ordersApi from './index';
import { Types } from 'mongoose';
import paymentMethodsApi from './paymentMethods';

const orderShippingModel = models.orderShippingModel;

class ShippingMethodsApi {
 constructor() {}

 getFilter(params = {}) {
     const filter = {};
     const enabled = parse.getBooleanIfValid(params.enabled);
     const _id = params._id;
     const order_id = params.order_id;

     if(_id) filter._id = _id;
     if(enabled !== null) filter.enabled === enabled;

     if(order_id) {
        const order = ordersApi.getSingleOrder(order_id);
        if(order) {
            filter['$and'] = [];
            filter['$and'].push({
                $or: [
                    {
                        'conditions.weight_total_min': 0
                    },
                    {
                        'conditions.weight_total_min': {
                            $lte: order.weight_total
                        }
                    }
                ]
            });
            filter['$and'].push({
                $or: [
                    {
                        'conditions.weight_total_max': 0
                    },
                    {
                        'conditions.weight_total_max': {
                            $gte: order.weight_total
                        }
                    }
                ]
            });

            filter['$and'].push({
                $or: [
                    {
                        'conditions.subtotal_min': 0
                    },
                    {
                        'conditions.subtotal_min': {
                            $lte: order.subtotal
                        }
                    }
                ]
            });
            filter['$and'].push({
                $or: [
                    {
                        'conditions.subtotal_max': 0
                    },
                    {
                        'conditions.subtotal_max': {
                            $gte: order.subtotal
                        }
                    }
                ]
            });

            if (
                order.shipping_address.country &&
                order.shipping_address.country.length > 0
            ) {
                filter['$and'].push({
                    $or: [
                        {
                            'conditions.countries': {
                                $size: 0
                            }
                        },
                        {
                            'conditions.countries': order.shipping_address.country
                        }
                    ]
                });
            }

            if (
                order.shipping_address.state &&
                order.shipping_address.state.length > 0
            ) {
                filter['$and'].push({
                    $or: [
                        {
                            'conditions.states': {
                                $size: 0
                            }
                        },
                        {
                            'conditions.states': order.shipping_address.state
                        }
                    ]
                });
            }

            if (
                order.shipping_address.city &&
                order.shipping_address.city.length > 0
            ) {
                filter['$and'].push({
                    $or: [
                        {
                            'conditions.cities': {
                                $size: 0
                            }
                        },
                        {
                            'conditions.cities': order.shipping_address.city
                        }
                    ]
                });
            }
            return filter;
        }
     }
     else return filter
    }  



    async getMethods(params = {}) {
        const filter = await this.getFilter(params);
        return await orderShippingModel.find(filter)
    }

    async getSingleMethod(id) {
        if (!Types.ObjectId.isValid(id)) {
            return `Invalid identifier`;
        }

        return await orderShippingModel.findById(id);
    }
    
    async addMethod(data) {
        return await orderShippingModel.create(data);
    }

    async updateMethod(id, data) {
        if (!Types.ObjectId.isValid(id)) {
            return `Invalid identifier`;
        }

        return await orderShippingModel.findByIdAndUpdate(id, data);
    }

    async deleteMethod(id) {
        if (!Types.ObjectId.isValid(id)) {
            return `Invalid identifier`;
        }

        const result = await orderShippingModel.findByIdAndDelete(id);
        await paymentMethodsApi.pullShippingMethod(id);
        return result;
    }

    async getMethodPrice(id) {
        let filter = {};
        if (id) {
            filter._id = id;
        }

        const methods = await this.getMethods(filter)
        return methods.length > 0 ? methods[0].price || 0 : 0;
    }

	getFields(fields) {
		if (fields && Array.isArray(fields) && fields.length > 0) {
			return fields.map(field => ({
				key: parse.getString(field.key),
				label: parse.getString(field.label),
				required: parse.getBooleanIfValid(field.required, false)
			}));
		} else {
			return [];
		}
	}
}

export default new ShippingMethodsApi();