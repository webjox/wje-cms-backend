import models from '../models';
import parse from '../../libs/parse';
import webhooks from '../../libs/webhooks';
import customerGroupsApi from './customerGroups';
import {Types} from 'mongoose';
import logger from 'winston';
import config from '../../../config';
import api from '../api';

const customerModel = models.customerModel;

class CustomersApi {
    constructor() {}

    async getFilter(params = {}) {
        // tag
		// gender
		// date_created_to
		// date_created_from
		// total_spent_to
		// total_spent_from
		// orders_count_to
		// orders_count_from

        const filter = {};

        if (params._id) {
			filter._id = params._id
		}

		if (params.group_id) {
			filter.group_id = params.group_id;
		}

		if (params.email) {
			filter.email = params.email.toLowerCase();
		}

        if(params.search) {
            filter['$or'] = [
				{ email: new RegExp(params.search, 'i') },
				{ mobile: new RegExp(params.search, 'i') },
				{ $text: { $search: params.search } }
            ]
        }

        return filter;
    }

    async getCustomers(params = {}) {
        const filter = await this.getFilter(params);
        const limit = params.limit > -1 ? params.limit : 1000;
        const offset = params.offset > -1 ? params.offset : 0;

        try {
            const customerGroups = await customerGroupsApi.getGroups();
            const customers = await customerModel.find(filter)
                .sort({data_created: -1})
                .skip(offset)
                .limit(limit);
            const customersCount = await customerModel.countDocuments(filter); 
            
            for(let i = 0; i < customers.length; i++) {
                customers[i] = await this.changeProperties(customers[i], customerGroups);
            }

            // const items = customers.map( async (customer) => {
            //    await this.changeProperties(customer, customerGroups)}
            // );
            // console.log(items);
            const result = {
                total_count: customersCount,
                has_more: offset + customers.length < customersCount,
                data: customers
            };
            return result;
        } catch (error) {
            logger.error(error.toString())
        }

    }

    async getSingleCustomer(id) {
        if (!Types.ObjectId.isValid(id)) {
			return 'Invalid identifier'
		}
        const customer = await customerModel.findById(id);
        const result = await this.changeProperties(customer);
        return result;
    }

    async addCustomer(data) {
        if(data.email && data.email.length > 0) {
            const customerCount = await customerModel.countDocuments({email: data.email});
            if(customerCount > 0) {
                return 'Customer email must be unique'
            }
        }
        
        try {
            const customer = await customerModel.create(data);
            await webhooks.trigger({
                event: webhooks.events.CUSTOMER_CREATED,
                payload: customer
            });
            return customer;
        } catch (error) {
            logger.error(error.toString())
        }
    }

    async updateCustomer(id, data) {
        if (!Types.ObjectId.isValid(id)) {
			return 'Invalid identifier'
		}

        if(data.email && data.email.length > 0) {
            const customerCount = await customerModel.countDocuments({email: data.email});
            if(customerCount > 0) {
                return 'Customer email must be unique'
            }
        }

        try {
            const customer = await customerModel.findByIdAndUpdate(id, data);
            if(data.wholesaler !== undefined) { // update wholesaler discount for draft order
                const orders = await api.orders.getOrders({customer_id: customer._id, draft: true});
                await orders.data.map(async (item) => {
                    await api.orderItems.calculateAndUpdateAllItems(item._id);
                })
            }
            return customer;   
        } catch (error) {
            logger.error(error.toString())
        }
    }

    async updateCustomerStatistics(customerId, totalSpent, ordersCount) {
        if (!Types.ObjectId.isValid(customerId)) {
			return 'Invalid identifier'
		}

        const customerData = {
            total_spent: totalSpent,
            orders_count: ordersCount
        }

        try {
            const result = await customerModel.findByIdAndUpdate(customerId, customerData);
            return result;   
        } catch (error) {
            logger.error(error.toString())
        }
    }

    async deleteCustomer(customerId) {
        if (!Types.ObjectId.isValid(customerId)) {
			return 'Invalid identifier'
		}
        try {
            const customer = await this.getSingleCustomer(customerId);
            const result = await customerModel.findByIdAndDelete(customerId);
            return result;   
        } catch (error) {
            logger.error(error.toString())
        }
    }

    async getOrderSumForYear(customerId) {
        const to_date = new Date();
        let from_date = new Date();
        from_date.setFullYear(from_date.getFullYear() - 1);


        const orders = await models.orderModel.find({customer_id: customerId, date_paid: {
            $gte: from_date,
            $lt: to_date
        }})
        let sum = 0;
        orders.map(order => {
            order.items.map(item => {
                sum += item.price_total;
            })
        })
        return sum;
    }

    getUserDiscountFromSum(sum, wholesaler) {
        let discount = 0;
        if(wholesaler) {
            config.discountsForWholesalerCustomers.map((item, index) => {
                if(sum > item) discount = index + 1;
            })
        }

        return discount * 5;
    }

    logout() {
        localStorage.removeItem('user');
    }

    // getAll() {
    //     const requestOptions = {
    //         method: 'GET'
    //     };

	// 	return fetch(`${security.storeBaseUrl}/users`, requestOptions).then(
	// 		handleResponse
	// 	);
    // }

	handleResponse(response) {
		return response.text().then(text => {
			const data = text && JSON.parse(text);
			if (!response.ok) {
				if (response.status === 401) {
					// auto logout if 401 response returned from api
					logout();
					location.reload(true);
				}

				const error = (data && data.message) || response.statusText;
				return Promise.reject(error);
			}

			return data;
		});
	}

    async changeProperties(customer, customerGroups) {
        if(customer) {
            const customerGroup = customer.group_id ? customerGroups.find(
                group => group._id.equals(customer._group_id)
            ) : null;

            customer.year_spent = await this.getOrderSumForYear(customer._id);
            customer.discount = this.getUserDiscountFromSum(customer.year_spent, customer.wholesaler);

            customer.group_name = 
                customerGroup && customerGroup.name ? customerGroup.name : '';
            
            }
            return customer;
        }
    }

    export default new CustomersApi();