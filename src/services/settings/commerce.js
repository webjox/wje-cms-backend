import logger from 'winston';
import models from '../models';

const { CommerceSettingsModel } = models;

class CommerceSettingsApi {
  constructor() {
    this.defaultSettings = {
      status: '',
      serviceOptions: '',
      deliveryRadius: '',
    };
  }

  async retrieveCommerceSettings() {
    const data = await CommerceSettingsModel.findOne();
    return this.changeProperties(data);
  }

  async updateCommerceSettings(data) {
    await this.insertDefaultSettingsIfEmpty;
    try {
      await CommerceSettingsModel.findOneAndUpdate({}, data, { upsert: true });
      return this.retrieveCommerceSettings();
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async insertDefaultSettingsIfEmpty() {
    const countOfDocs = await CommerceSettingsModel.countDocuments();
    if (countOfDocs === 0) {
      const result = await CommerceSettingsModel.create(this.defaultSettings);
      return result;
    }
  }

  changeProperties(settings) {
    if (settings) {
      delete settings._id;
    } else {
      return this.defaultSettings;
    }

    return settings;
  }
}

export default new CommerceSettingsApi();
