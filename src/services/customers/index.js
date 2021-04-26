import { Types } from 'mongoose';
import logger from 'winston';
import models from '../models';
import customerGroupsApi from './customerGroups';
import config from '../../../config';
import api from '../api';

const { CustomerModel } = models;

class CustomersApi {
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
      filter._id = params._id;
    }

    if (params.group_id) {
      filter.group_id = params.group_id;
    }

    if (params.email) {
      filter.email = params.email.toLowerCase();
    }

    if (params.search) {
      filter.$or = [
        { email: new RegExp(params.search, 'i') },
        { mobile: new RegExp(params.search, 'i') },
        { $text: { $search: params.search } },
      ];
    }

    return filter;
  }

  async getCustomers(params = {}) {
    const filter = await this.getFilter(params);
    const limit = params.limit > -1 ? params.limit : 1000;
    const offset = params.offset > -1 ? params.offset : 0;
    try {
      const customerGroups = await customerGroupsApi.getGroups();
      let customers = await CustomerModel.find(filter)
        .sort({ data_created: -1 })
        .skip(offset)
        .limit(limit);
      const customersCount = await CustomerModel.countDocuments(filter);

      for (let i = 0; i < customers.length; i += 1) {
        customers[i] = this.changeProperties(customers[i], customerGroups);
      }
      customers = await Promise.all(customers);
      // const items = customers.map( async (customer) => {
      //    await this.changeProperties(customer, customerGroups)}
      // );
      // console.log(items);
      const result = {
        total_count: customersCount,
        has_more: offset + customers.length < customersCount,
        data: customers,
      };
      return result;
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async getSingleCustomer(id) {
    if (!Types.ObjectId.isValid(id)) {
      return 'Invalid identifier';
    }
    const customer = await CustomerModel.findById(id);
    const result = await this.changeProperties(customer);
    return result;
  }

  async addCustomer(data) {
    if (data.email && data.email.length > 0) {
      const customerCount = await CustomerModel.countDocuments({ email: data.email });
      if (customerCount > 0) {
        return 'Customer email must be unique';
      }
    }

    try {
      const customer = await CustomerModel.create(data);
      return customer;
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async updateCustomer(id, data) {
    if (!Types.ObjectId.isValid(id)) {
      return 'Invalid identifier';
    }

    if (data.email && data.email.length > 0) {
      const customerCount = await CustomerModel.countDocuments({ email: data.email });
      if (customerCount > 0) {
        return 'Customer email must be unique';
      }
    }

    data.wholesaler_settings = this.validWholeSalerSettingsToUpdate(data);

    try {
      const customer = await CustomerModel.findByIdAndUpdate(id, data);
      if (data.wholesaler !== undefined) {
        // update wholesaler discount for draft order
        const orders = await api.orders.getOrders({ customer_id: customer._id, draft: true });
        await orders.data.map(async item => {
          await api.orderItems.calculateAndUpdateAllItems(item._id);
        });
      }
      const result = await this.getSingleCustomer(id);
      return result;
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async updateCustomerStatistics(customerId, totalSpent, ordersCount) {
    if (!Types.ObjectId.isValid(customerId)) {
      return 'Invalid identifier';
    }

    const customerData = {
      total_spent: totalSpent,
      orders_count: ordersCount,
    };

    try {
      await CustomerModel.findByIdAndUpdate(customerId, customerData);
      const result = await this.getSingleCustomer(customerId);
      return result;
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async deleteCustomer(customerId) {
    if (!Types.ObjectId.isValid(customerId)) {
      return 'Invalid identifier';
    }
    try {
      await CustomerModel.findByIdAndDelete(customerId);
      return { status: 'success' };
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async getOrderSumForYear(customerId) {
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setFullYear(fromDate.getFullYear() - 1);

    const orders = await api.orders.getOrders({
      customer_id: customerId,
      date_paid: {
        $gte: fromDate,
        $lte: toDate,
      },
    });
    let sum = 0;
    orders.data.map(order => {
      order.items.map(item => {
        sum += item.price_total;
      });
    });
    return sum;
  }

  getUserDiscountFromSum(sum, wholesaler) {
    let discount = 0;
    if (wholesaler) {
      config.discountsForWholesalerCustomers.map((item, index) => {
        if (sum > item) discount = index + 1;
      });
    }

    return discount * 5;
  }

  async changeProperties(customer, customerGroups) {
    if (customer) {
      const customerGroup = customer.group_id
        ? customerGroups.find(group => group._id.equals(customer.group_id))
        : null;

      customer.year_spent = await this.getOrderSumForYear(customer._id);
      customer.discount = this.getUserDiscountFromSum(customer.year_spent, customer.wholesaler);

      customer.group_name = customerGroup && customerGroup.name ? customerGroup.name : '';
    }
    return customer;
  }

  validWholeSalerSettingsToUpdate(customerData) {
    const result = {};
    const wholesalerSettings = customerData.wholesaler_settings;
    if (wholesalerSettings) {
      result.organizationName = wholesalerSettings.organizationName;
      result.itn = wholesalerSettings.itn;
      result.bic = wholesalerSettings.bic;
      result.correspondingAccount = wholesalerSettings.correspondingAccount;
      result.psrn = wholesalerSettings.psrn;
      result.bankName = wholesalerSettings.bankName;
      result.currentAccount = wholesalerSettings.currentAccount;
      result.legalAddress = wholesalerSettings.legalAddress;
      result.actualAddress = wholesalerSettings.actualAddress;
    }
    return result;
  }
}

export default new CustomersApi();
