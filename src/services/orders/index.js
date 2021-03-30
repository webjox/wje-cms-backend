import config from '../../../config/index';
import parse from '../../libs/parse';
import models from '../models';
import orderStatusesApi from './orderStatuses';
import paymentMethods from './paymentMethods';
import shippingMethods from './shippingMethods';
import customersApi from '../customers';
import { Types } from 'mongoose';
import bcrypt from 'bcrypt';
import webhooks from '../../libs/webhooks';
import handlebars from 'handlebars';
import mailer from '../../libs/mailer';
import EmailTemplatesApi from '../settings/emailTemplates';
import SettingsApi from '../settings/settings';
import dashboardWebSocket from '../../libs/dashboardWebSocket';
import productsApi from '../products';
import logger from 'winston';
import PaymentGateways from '../../paymentGateways';

const { saltRounds } = config.saltRounds;

const orderModel = models.orderModel;

class OrdersApi {
    constructor() {}

    getFilter(params = {}) {
        const filter = {};
        const _id = params._id;
        const status_id = params.status_id;
        const customer_id = params.customer_id;
        const payment_method_id = params.payment_method_id;
        const shipping_method_id = params.shipping_method_id;
        const closed = parse.getBooleanIfValid(params.closed);
        const cancelled = parse.getBooleanIfValid(params.cancelled);
		const delivered = parse.getBooleanIfValid(params.delivered);
		const paid = parse.getBooleanIfValid(params.paid);
		const draft = parse.getBooleanIfValid(params.draft);
		const hold = parse.getBooleanIfValid(params.hold);
		const grand_total_min = parse.getNumberIfPositive(params.grand_total_min);
		const grand_total_max = parse.getNumberIfPositive(params.grand_total_max);
		const date_placed_min = parse.getDateIfValid(params.date_placed_min);
		const date_placed_max = parse.getDateIfValid(params.date_placed_max);
		const date_closed_min = parse.getDateIfValid(params.date_closed_min);
		const date_closed_max = parse.getDateIfValid(params.date_closed_max);
        if (_id) {
			filter._id = _id;
		}

		if (status_id) {
			filter.status_id = status_id;
		}

		if (customer_id) {
			filter.customer_id = customer_id;
		}

		if (payment_method_id) {
			filter.payment_method_id = payment_method_id;
		}

		if (shipping_method_id) {
			filter.shipping_method_id = shipping_method_id;
		}

		if (params.number) {
			filter.number = params.number;
		}

		if (closed !== null) {
			filter.closed = closed;
		}

		if (cancelled !== null) {
			filter.cancelled = cancelled;
		}

		if (delivered !== null) {
			filter.delivered = delivered;
		}

		if (paid !== null) {
			filter.paid = paid;
		}

		if (draft !== null) {
			filter.draft = draft;
		}

		if (hold !== null) {
			filter.hold = hold;
		}

		if (grand_total_min || grand_total_max) {
			filter.grand_total = {};
			if (grand_total_min) {
				filter.grand_total.$gte = grand_total_min;
			}
			if (grand_total_max) {
				filter.grand_total.$lte = grand_total_max;
			}
		}

		if (date_placed_min || date_placed_max) {
			filter.date_placed = {};
			if (date_placed_min) {
				filter.date_placed.$gte = date_placed_min;
			}
			if (date_placed_max) {
				filter.date_placed.$lte = date_placed_max;
			}
		}

		if (date_closed_min || date_closed_max) {
			filter.date_closed = {};
			if (date_closed_min) {
				filter.date_closed.$gte = date_closed_min;
			}
			if (date_closed_max) {
				filter.date_closed.$lte = date_closed_max;
			}
		}

        if (params.search) {
			const alternativeSearch = [];

			const searchAsNumber = parse.getNumberIfPositive(params.search);
			if (searchAsNumber) {
				alternativeSearch.push({ number: searchAsNumber });
			}

			alternativeSearch.push({ first_name: new RegExp(params.search, 'i') });
			alternativeSearch.push({ last_name: new RegExp(params.search, 'i') });
			alternativeSearch.push({ password: new RegExp(params.search, 'i') });
			alternativeSearch.push({ email: new RegExp(params.search, 'i') });
			alternativeSearch.push({ mobile: new RegExp(params.search, 'i') });
			alternativeSearch.push({ $text: { $search: params.search } });

			filter.$or = alternativeSearch;
		}
        return filter;
    }

    async getOrders(params) {
        const filter = await this.getFilter(params);
        // const limit = parse.getNumberIfPositive(params.limit || 1000);
        // const offset = parse.getNumberIfPositive(params.offset || 0);
        const orders = await orderModel
            .find(filter)
            .sort({date_placed: 1, date_created: 1})
            // .skip(offset)
            // .limit(limit); 

        const countOfOrders = await orderModel.countDocuments(filter);
        const orderStatuses = await orderStatusesApi.getStatuses();
        const ShippingMethods = await shippingMethods.getMethods();
        const PaymentMethods = await paymentMethods.getMethods();
        const items = orders.map(order => 
             this.changeProperties(order, orderStatuses, ShippingMethods, PaymentMethods)
        );
        const result = {
            total_count: countOfOrders,
            has_more: items.length < countOfOrders, // offset + item.length < countOfOrders
            data: items
        }
        return result;
    }

    async getSingleOrder(id) {
        if(!Types.ObjectId.isValid(id)) {
            return 'Invalid Identifier'
        }

        const orders = await this.getOrders({_id: id});
		const result = orders.data[0] || {};
        return result;
    }

    async getOrCreateCustomer(orderId) {
        const order = await this.getSingleOrder(orderId);
        if(!order.customer_id && order.email) {
            const customers = await customersApi.getCustomers({email: order.email});
            const customerExists = customers && customers.data && customers.data.length > 0;
            if(customerExists) {
                // if customer exist - set new customer_id
                order.customer_id = customers.data[0]._id;
                return order;
            }
            // if customer not exist - create new customer and set new customer_id
            const addresses = [];
            if(order.shipping_address) {
                addresses.push(order.shipping_addresses);
            }
            
            const salt = await bcrypt.genSalt(saltRounds);
            const hashPassword = await bcrypt.hash(order.password, salt);

            const customer = await customersApi.addCustomer({
                first_name: order.first_name,
                last_name: order.last_name,
                password: hashPassword,
                email: order.email,
                full_name: `${order.first_name} ${order.last_name}`,
                mobile: order.mobile,
                browser: order.browser,
                adresses: order.shipping_address
            });
            order.customer_id = customer.id;
            return order;

        }
    }

    async addOrder(data) {
		try {
			const orderData = await this.getValidDocumentForInsert(data);
			const order = await orderModel.create(orderData);
			return order;	
		} catch (error) {
			logger.error(error.toString());
		}
    }

	async getValidDocumentForInsert(data) {
		const lastOrder = await orderModel.find({}, {number: 1}).sort({number: -1}).limit(1);
		let orderNumber = config.orderStartNumber;
		if(lastOrder && lastOrder.length > 0) {
			orderNumber = lastOrder[0].number + 1;
		};
		data.number = orderNumber;
		return data;
	}

    async updateOrder(id, data, options = {}) {
		if(!Types.ObjectId.isValid(id)) {
            return 'Invalid Identifier'
        }
		// if(data.paid_date) data.paid_date = new Date(data.paid_date)
		const response = await orderModel.findByIdAndUpdate(id, data, options);
		await this.updateCustomerStatistics(response.customer_id);
		return response;
    }

	async deleteOrder(id) {
		if(!Types.ObjectId.isValid(id)) {
            return 'Invalid Identifier'
        }

		const deletedObject = await orderModel.findByIdAndDelete(id);
		await webhooks.trigger({
			event: webhooks.events.ORDER_DELETED,
			payload: deletedObject
		});
		return deletedObject;
	}
	
	getEmailSubject (emailTemplate, order) {
		if(emailTemplate && order) {
		const subjectTemplate = handlebars.compile(emailTemplate.subject);
		return subjectTemplate(order);
		} else return null;
	}

	getEmailBody(emailTemplate, order) {
		if(emailTemplate && order) {
		const bodyTemplate = handlebars.compile(emailTemplate.body);
		return bodyTemplate(order);
		} else return null;
	}

	async sendAllMails(toEmail, copyTo, subject, body) {
		await mailer.send({
			to: toEmail,
			subject,
			html: body
		});
		await mailer.send({
			to: copyTo,
			subject,
			html: body
		})
	}

	async checkoutOrder(orderId) {
		const customer_id = await this.getOrCreateCustomer(orderId);
		const order = await this.updateOrder(orderId, {
			customer_id,
			date_placed: new Date(),
			draft: false
		});
		const emailTemplate = await EmailTemplatesApi.getEmailTemplate('order_confirmation');
		const dashboardSettings = await SettingsApi.getSettings();
		const subject = this.getEmailSubject(emailTemplate, order);
		const body = this.getEmailBody(emailTemplate, order);
		const copyTo = dashboardSettings.order_confirmation_copy_to;
		try {
			this.sendAllMails(order.email, copyTo, subject, body);
			productsApi.handleOrderCheckout(orderId);
		} catch (error) {
			logger.error(error.toString());
		}

		return order;
	}
	
	async cancelOrder(orderId) {
		try {
			await productsApi.handleCancelOrder(orderId);
			return await this.updateOrder(orderId, { cancelled: true });
		} catch (error) {
			logger.error(error.toString());
		}
	}

	async closeOrder(orderId) {
		return await this.updateOrder(orderId, { closed: true });
	}

	async updateCustomerStatistics(customerId) {
		if(customerId) {
			const orders = await this.getOrders({ customer_id: customerId });
			let totalSpent = 0;
			let ordersCount = 0;

			if(orders.data && orders.data.length > 0) {
				for (const order of orders.data) {
					if(order.draft === false) {
						ordersCount++;
					}
					if(order.paid === true || order.closed === true) {
						totalSpent += order.grand_total;
					}
				}
			}

			return await customersApi.updateCustomerStatistics(
				customerId, totalSpent, ordersCount
			)
		}
	}

	async chargeOrder(orderId) {
		const order = await this.getSingleOrder(orderId);
		const isSuccess = await PaymentGateways.processOrderPayment(order);
		return isSuccess;
	}

    changeProperties (order, orderStatuses, shippingMethods, paymentMethods) {
        if(order) {
            const orderStatus = order.status_id && orderStatuses.length > 0 ?
                orderStatuses.find(
                    status => status._id.equals(order.status_id)
                ) : null;
            
            const orderShippingMethod = order.shipping_method_id && shippingMethods.length > 0 ?
                shippingMethods.find(
                    method => method._id.equals(order.shipping_method_id)
                ) : null;
        
            const orderPaymentMethod = order.payment_method_id && paymentMethods.length > 0 ?
                paymentMethods.find(
                    method => method._id.equals(order.payment_method_id)
                ) : null;

            order.status = orderStatus ? orderStatus.name : '';
            order.shipping_method = orderShippingMethod ? orderShippingMethod.name : '';
            order.payment_method = orderPaymentMethod ? orderPaymentMethod.gateway : '';

            let sum_items_weight = 0;
			let sum_items_price_total = 0;
			let sum_items_discount_total = 0;
			let sum_discounts_amount = 0;
			let sum_items_tax_total = 0;

            if (order.items && order.items.length > 0) {
				order.items.forEach(item => {
					const item_weight = item.weight * item.quantity;
					if (item_weight > 0) {
						sum_items_weight += item_weight;
					}
				});

				order.items.forEach(item => {
					if (item.price_total > 0) {
						sum_items_price_total += item.price_total;
					}
				});

				order.items.forEach(item => {
					if (item.price_total > 0 && order.tax_rate > 0) {
						if (order.item_tax_included) {
							sum_items_tax_total +=
								item.price_total -
								item.price_total / (1 + order.tax_rate / 100);
						} else {
							sum_items_tax_total += item.price_total * (order.tax_rate / 100);
						}
					}
				});

				order.items.forEach(item => {
					if (item.discount_total > 0) {
						sum_items_discount_total += item.discount_total;
					}
				});
			}

            const tax_included_total =
				(order.item_tax_included ? 0 : sum_items_tax_total) +
				(order.shipping_tax_included ? 0 : order.shipping_tax);

			if (order.discounts && order.discounts.length > 0) {
				order.items.forEach(item => {
					if (item.amount > 0) {
						sum_discounts_amount += item.amount;
					}
				});
			}

            const tax_total = sum_items_tax_total + order.shipping_tax;
			const shipping_total = order.shipping_price - order.shipping_discount;
			const discount_total = sum_items_discount_total + sum_discounts_amount;
			const grand_total =
				sum_items_price_total +
				shipping_total +
				tax_included_total -
				discount_total;

			order.weight_total = sum_items_weight;
			order.discount_total = discount_total; // sum(items.discount_total)+sum(discounts.amount)
			order.subtotal = sum_items_price_total; // sum(items.price_total)
			order.tax_included_total = tax_included_total; // if(item_tax_included, 0, item_tax) + if(shipment_tax_included, 0, shipping_tax)
			order.tax_total = tax_total; // item_tax + shipping_tax
			order.shipping_total = shipping_total; // shipping_price-shipping_discount
			order.grand_total = grand_total; // subtotal + shipping_total + tax_included_total - (discount_total) 
        }

        return order;
    }

}

export default new OrdersApi();