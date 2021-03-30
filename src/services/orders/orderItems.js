import ordersApi from './index';
import productsApi from '../products';
import { Types } from 'mongoose';
import models from '../models';
import parse from '../../libs/parse';
import logger from 'winston';
import api from '../api';

const orderItemModel = models.orderItemModel;

class OrderItemsService {
    constructor() {}

    async addItem(order_id, data) {
        if(!Types.ObjectId.isValid(order_id)) {
            return `Invalid identifier`;
        }

        const newItem = new orderItemModel(data);
        const orderItem = await this.getOrderItemIfExists(
            order_id,
            newItem.product_id,
			newItem.variant_id
        );
		if (orderItem) {
			await this.updateItemQuantityIfAvailable(order_id, orderItem, newItem);
		} else {
			await this.addNewItem(order_id, newItem);
		}
		const result = await ordersApi.getSingleOrder(order_id);
        return result;
    }

	async updateItemQuantityIfAvailable(order_id, orderItem, newItem) {
		const quantityNeeded = orderItem.quantity + newItem.quantity;
		const availableQuantity = await this.getAvailableProductQuantity(
			newItem.product_id,
			newItem.variant_id,
			quantityNeeded
		);
		if (availableQuantity > 0) {
			await this.updateItem(order_id, orderItem._id, {
				quantity: quantityNeeded
			});
		}
	}

    async addNewItem(order_id, newItem) {
		const availableQuantity = await this.getAvailableProductQuantity(
			newItem.product_id,
			newItem.variant_id,
			newItem.quantity
		);
		if (availableQuantity > 0) {
			newItem.quantity = availableQuantity;
            
		    await ordersApi.updateOrder(order_id, {$push: {items: newItem}});
			await this.calculateAndUpdateItem(order_id, newItem._id);
			await productsApi.handleAddOrderItem(order_id, newItem._id);
		}
	}

	async getAvailableProductQuantity(product_id, variant_id, quantityNeeded) {
		const product = await productsApi.getProductById(
			product_id
		);
		if (!product) {
			return 0;
		} else if (product.discontinued) {
			return 0;
		} else if (product.stock_backorder) {
			return quantityNeeded;
		} else if (product.variable && variant_id) {
			const variant = this.getVariantFromProduct(product, variant_id);
			if (variant) {
				return variant.stock_quantity >= quantityNeeded
					? quantityNeeded
					: variant.stock_quantity;
			} else {
				return 0;
			}
		} else {
			return product.stock_quantity >= quantityNeeded
				? quantityNeeded
				: product.stock_quantity;
		}
	}

    getVariantFromProduct(product, variantId) {
		if (product.variants && product.variants.length > 0) {
			return product.variants.find(
				variant => variant._id.equals(variantId)
			);
		} else {
			return null;
		}
	}

    getOptionFromProduct(product, optionId) {
		if (product.options && product.options.length > 0) {
			return product.options.find(
				item => item._id.equals(optionId)
			);
		} else {
			return null;
		}
	}

	getOptionValueFromProduct(product, optionId, valueId) {
		const option = this.getOptionFromProduct(product, optionId);
		if (option && option.values && option.values.length > 0) {
			return option.values.find(
				item => item._id.equals(valueId)
			);
		} else {
			return null;
		}
	}

	getOptionNameFromProduct(product, optionId) {
		const option = this.getOptionFromProduct(product, optionId);
		return option ? option.name : null;
	}

	getOptionValueNameFromProduct(product, optionId, valueId) {
		const value = this.getOptionValueFromProduct(product, optionId, valueId);
		return value ? value.name : null;
	}

    getVariantNameFromProduct(product, variantId) {
		const variant = this.getVariantFromProduct(product, variantId);
		if (variant) {
			let optionNames = [];
			for (const option of variant.options) {
				const optionName = this.getOptionNameFromProduct(
					product,
					option.option_id
				);
				const optionValueName = this.getOptionValueNameFromProduct(
					product,
					option.option_id,
					option.value_id
				);
				optionNames.push(`${optionName}: ${optionValueName}`);
			}
			return optionNames.join(', ');
		}

		return null;
	}


    async calculateAndUpdateItem(orderId, itemId) {
		// TODO: tax_total, discount_total
		const order = await ordersApi.getSingleOrder(orderId);
		if (order && order.items && order.items.length > 0) {
			const item = order.items.find(i => i._id.equals(itemId));
			if (item) {
				const itemData = await this.getCalculatedData(item);
				if(order.customer_id) {
					const customer = await api.customers.getSingleCustomer(order.customer_id);
					itemData.discount_total = customer.discount;
				}

                order.items.map(item => {
                    if(item._id.equals(itemId)) {
                        Object.assign(item, itemData);
                    }
                })
                await ordersApi.updateOrder(order._id, {items: order.items});
			}
		}
	}

    async getCalculatedData(item) {
		const product = await productsApi.getProductById(
			item.product_id
		);

		if (item.custom_price && item.custom_price > 0) {
			// product with custom price - can set on client side
			return {
				product_image: product.images,
                sku: product.sku,
				name: product.name,
				variant_name: item.custom_note || '',
				price: item.custom_price,
				tax_class: product.tax_class,
				tax_total: 0,
				weight: product.weight || 0,
				discount_total: 0,
				price_total: item.custom_price * item.quantity
			};
		} else if (item.variant_id) {
			// product with variant
			const variant = this.getVariantFromProduct(product, item.variant_id);
			const variantName = this.getVariantNameFromProduct(
				product,
				item.variant_id
			);
			const variantPrice =
				variant.price && variant.price > 0 ? variant.price : product.price;

			if (variant) {
				return {
					product_image: product.images,
					sku: variant.sku,
					name: product.name,
					variant_name: variantName,
					price: variantPrice,
					tax_class: product.tax_class,
					tax_total: 0,
					weight: variant.weight || 0,
					discount_total: 0,
					price_total: variantPrice * item.quantity
				};
			} else {
				// variant not exists
				return null;
			}
		} else {
			// normal product
			return {
				product_image: product.images,
				sku: product.sku,
				name: product.name,
				variant_name: '',
				price: product.price,
				tax_class: product.tax_class,
				tax_total: 0,
				weight: product.weight || 0,
				discount_total: 0,
				price_total: product.price * item.quantity
			};
		}
	}


	async calculateAndUpdateAllItems(order_id) {
		const order = await ordersApi.getSingleOrder(order_id);


		if (order && order.items) {
			for (const item of order.items) {
				await this.calculateAndUpdateItem(order_id, item._id);
			}
			return ordersApi.getSingleOrder(order_id);
		} else {
			// order.items is empty
			return null;
		}
	}

    async getOrderItemIfExists(order_id, product_id, variant_id) {
        const order = await ordersApi.getSingleOrder(order_id);
        if (order && order.items && order.items.length > 0) {
			const result = order.items.find(
				item =>
					item.product_id.equals(product_id) &&
					(item.variant_id || '').toString() === (variant_id || '').toString()
			);
			return result;
		} else {
			return null;
		}
    }

    async updateItem(order_id, item_id, data) {
        if (!Types.ObjectId.isValid(order_id) || !Types.ObjectId.isValid(item_id)) {
			return 'Invalid identifier';
		}

        if(parse.getNumberIfPositive(data.quantity) === 0) {
            //delete item
            return this.deleteItem(order_id, item_id);
        } else {
            //update
            await productsApi.handleDeleteOrderItem(order_id, item_id);
            const order = await ordersApi.getSingleOrder(order_id);
            if(order) {
                order.items.map(item => item._id.equals(item_id) ? Object.assign(item, data) : null)
                const updatedOrder = await ordersApi.updateOrder(order_id, {items: order.items});
                await this.calculateAndUpdateItem(order_id, item_id);
                await productsApi.handleAddOrderItem(order_id, item_id);
                return updatedOrder;
            } else return new Error(`failed, order not found`);
        }
    }


    async deleteItem(order_id, item_id) {
        if (!Types.ObjectId.isValid(order_id) || !Types.ObjectId.isValid(item_id)) {
			return 'Invalid identifier';
		}
		const itemObjetId = new Types.ObjectId(item_id);
        await productsApi.handleDeleteOrderItem(order_id, item_id);
        const updatedOrder = await ordersApi.updateOrder(
            order_id,
            { $pull: { items: { _id: itemObjetId }}},
			{new: true}
        );
        return updatedOrder
    }
}

export default new OrderItemsService();