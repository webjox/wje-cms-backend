import { Types } from 'mongoose';
import ordersApi from './index';
import productsApi from '../products';
import models from '../models';
import parse from '../../libs/parse';
import api from '../api';

const { OrderItemModel } = models;

class OrderItemsService {
  async addItem(orderId, data) {
    if (!Types.ObjectId.isValid(orderId)) {
      return `Invalid identifier`;
    }

    const newItem = new OrderItemModel(data);
    const orderItem = await this.getOrderItemIfExists(
      orderId,
      newItem.product_id,
      newItem.variant_id,
    );
    if (orderItem) {
      await this.updateItemQuantityIfAvailable(orderId, orderItem, newItem);
    } else {
      await this.addNewItem(orderId, newItem);
    }
    const result = await ordersApi.getSingleOrder(orderId);
    return result;
  }

  async updateItemQuantityIfAvailable(orderId, orderItem, newItem) {
    const quantityNeeded = orderItem.quantity + newItem.quantity;
    const availableQuantity = await this.getAvailableProductQuantity(
      newItem.product_id,
      newItem.variant_id,
      quantityNeeded,
    );
    if (availableQuantity > 0) {
      await this.updateItem(orderId, orderItem._id, {
        quantity: quantityNeeded,
      });
    }
  }

  async addNewItem(orderId, newItem) {
    const availableQuantity = await this.getAvailableProductQuantity(
      newItem.product_id,
      newItem.variant_id,
      newItem.quantity,
    );
    if (availableQuantity > 0) {
      newItem.quantity = availableQuantity;

      await ordersApi.updateOrder(orderId, { $push: { items: newItem } });
      await this.calculateAndUpdateItem(orderId, newItem._id);
      await productsApi.handleAddOrderItem(orderId, newItem._id);
    }
  }

  async getAvailableProductQuantity(productId, variantId, quantityNeeded) {
    const product = await productsApi.getProductById(productId);
    if (!product) {
      return 0;
    }
    if (product.discontinued) {
      return 0;
    }
    if (product.stock_backorder) {
      return quantityNeeded;
    }
    if (product.variable && variantId) {
      const variant = this.getVariantFromProduct(product, variantId);
      if (variant) {
        return variant.stock_quantity >= quantityNeeded ? quantityNeeded : variant.stock_quantity;
      }
      return 0;
    }
    let productQuantity = 0;
    product.shops.map(item => {
      productQuantity += item.quantity;
    });
    return productQuantity >= quantityNeeded ? quantityNeeded : productQuantity;
  }

  getVariantFromProduct(product, variantId) {
    if (product.variants && product.variants.length > 0) {
      return product.variants.find(variant => variant._id.equals(variantId));
    }
    return null;
  }

  getOptionFromProduct(product, optionId) {
    if (product.options && product.options.length > 0) {
      return product.options.find(item => item._id.equals(optionId));
    }
    return null;
  }

  getOptionValueFromProduct(product, optionId, valueId) {
    const option = this.getOptionFromProduct(product, optionId);
    if (option && option.values && option.values.length > 0) {
      return option.values.find(item => item._id.equals(valueId));
    }
    return null;
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
      const optionNames = [];
      for (const option of variant.options) {
        const optionName = this.getOptionNameFromProduct(product, option.option_id);
        const optionValueName = this.getOptionValueNameFromProduct(
          product,
          option.option_id,
          option.value_id,
        );
        optionNames.push(`${optionName}: ${optionValueName}`);
      }
      return optionNames.join(', ');
    }

    return null;
  }

  async calculateAndUpdateItem(orderId, itemId, discount) {
    // TODO: tax_total, discount_total
    const order = await ordersApi.getSingleOrder(orderId);
    if (order && order.items && order.items.length > 0) {
      const item = order.items.find(i => i._id.equals(itemId));
      if (item) {
        const itemData = await this.getCalculatedData(item, discount);
        if (order.customer_id) {
          const customer = await api.customers.getSingleCustomer(order.customer_id);
          itemData.discount_total = customer.discount;
        }

        order.items.map(orderItem => {
          if (orderItem._id.equals(itemId)) {
            Object.assign(orderItem, itemData);
          }
        });
        await ordersApi.updateOrder(order._id, { items: order.items });
        return { status: 'success' };
      }
    }
  }

  async getCalculatedData(item, discountStatus) {
    const product = await productsApi.getProductById(item.product_id);
    let discount = 0;
    let stockDiscount = 0;
    if (item.custom_price && item.custom_price > 0) {
      // product with custom price - can set on client side
      if (discountStatus) discount = (item.custom_price / 100) * item.discount_total;
      return {
        product_image: product.images,
        sku: product.sku,
        name: product.name,
        variant_name: item.custom_note || '',
        price: item.custom_price,
        tax_class: product.tax_class,
        tax_total: 0,
        weight: product.weight || 0,
        discount_total: item.discount_total,
        price_total: (item.custom_price - discount) * item.quantity,
      };
    }
    if (item.variant_id) {
      // product with variant
      const variant = this.getVariantFromProduct(product, item.variant_id);
      const variantName = this.getVariantNameFromProduct(product, item.variant_id);
      const variantPrice = variant.price && variant.price > 0 ? variant.price : product.price;

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
          discount_total: item.discount_total,
          stock_price_total: (variantPrice - discount) * item.quantity,
        };
      }
      // variant not exists
      return null;
    }
    // normal product
    if (discountStatus) {
      discount = (item.price / 100) * item.discount_total;
      stockDiscount = (item.stock_price / 100) * item.discount_total;
    }

    return {
      product_image: product.images,
      sku: product.sku,
      name: product.name,
      variant_name: '',
      stock_price: product.stock_price,
      price: product.price,
      tax_class: product.tax_class,
      tax_total: 0,
      weight: product.weight || 0,
      discount_total: item.discount_total,
      stock_price_total: (product.stock_price - stockDiscount) * item.quantity,
      price_total: (product.price - discount) * item.quantity,
    };
  }

  async calculateAndUpdateAllItems(orderId, discount) {
    const order = await ordersApi.getSingleOrder(orderId);

    if (order && order.items) {
      for (const item of order.items) {
        await this.calculateAndUpdateItem(orderId, item._id, discount);
      }
      const result = await ordersApi.getSingleOrder(orderId);
      return result;
    }
    // order.items is empty
    return null;
  }

  async getOrderItemIfExists(orderId, productId, variantId) {
    const order = await ordersApi.getSingleOrder(orderId);
    if (order && order.items && order.items.length > 0) {
      const result = order.items.find(
        item =>
          item.product_id.equals(productId) &&
          (item.variant_id || '').toString() === (variantId || '').toString(),
      );
      return result;
    }
    return null;
  }

  async updateItem(orderId, itemId, data) {
    if (!Types.ObjectId.isValid(orderId) || !Types.ObjectId.isValid(itemId)) {
      return 'Invalid identifier';
    }

    if (parse.getNumberIfPositive(data.quantity) === 0) {
      // delete item
      return this.deleteItem(orderId, itemId);
    }
    // update
    await productsApi.handleDeleteOrderItem(orderId, itemId);
    const order = await ordersApi.getSingleOrder(orderId);
    if (order) {
      order.items.map(item => (item._id.equals(itemId) ? Object.assign(item, data) : null));
      await ordersApi.updateOrder(orderId, { items: order.items });
      await this.calculateAndUpdateItem(orderId, itemId);
      await productsApi.handleAddOrderItem(orderId, itemId);
      const result = ordersApi.getSingleOrder(orderId);
      return result;
    }
    return new Error(`failed, order not found`);
  }

  async deleteItem(orderId, itemId) {
    if (!Types.ObjectId.isValid(orderId) || !Types.ObjectId.isValid(itemId)) {
      return 'Invalid identifier';
    }
    const itemObjetId = new Types.ObjectId(itemId);
    await productsApi.handleDeleteOrderItem(orderId, itemId);
    const updatedOrder = await ordersApi.updateOrder(
      orderId,
      { $pull: { items: { _id: itemObjetId } } },
      { new: true },
    );
    return updatedOrder;
  }
}

export default new OrderItemsService();
