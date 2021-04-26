import logger from 'winston';
import models from '../models';

const { CheckoutFieldsModel } = models;

class CheckoutFieldsApi {
  async getCheckoutFields() {
    const data = await CheckoutFieldsModel.find();
    data.map(field => {
      delete field._id;
      return field;
    });
  }

  async getCheckoutField(name) {
    const data = await CheckoutFieldsModel.findOne({ name });
    return this.changeProperties(data);
  }

  async updateCheckoutField(name, data) {
    try {
      return await CheckoutFieldsModel.findOneAndUpdate({ name }, data, { upsert: true });
    } catch (error) {
      logger.error(error.toString());
    }
  }

  changeProperties(field) {
    if (field) {
      delete field._id;
      delete field.name;
    } else {
      return {
        status: 'required',
        label: '',
        placeholder: '',
      };
    }

    return field;
  }
}

export default new CheckoutFieldsApi();
