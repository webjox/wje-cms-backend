/* eslint-disable no-template-curly-in-string */
import path from 'path';
import url from 'url';
import fs from 'fs';
import mongoose from 'mongoose';
import logger from 'winston';
import settingsSchema from '../schemas/settingsSchema';
import config from '../../../config';

const settings = mongoose.model('settings', settingsSchema);

class SettingsApi {
  constructor() {
    this.defaultSettings = {
      store_name: '',
      domain: config.storeBaseUrl,
      logo_file: 'logo.png',
      language: 'ru',
      currency_code: 'Rub',
      currency_symbol: '₽',
      currency_format: '${amount}',
      thousand_separator: ',',
      decimal_separator: '.',
      decimal_number: 2,
      timezone: 'Europe/Moscow',
      date_format: 'D MMMM, YYYY',
      time_format: 'h:mm a',
      default_shipping_country: '',
      default_shipping_state: '',
      default_shipping_city: '',
      default_product_sorting: 'stock_status,price,position',
      product_fields:
        'path,id,name,category_id,category_name,sku,images,enabled,discontinued,stock_status,stock_quantity,price,on_sale,regular_price,attributes,tags,position,video',
      products_limit: 30,
      weight_unit: 'kg',
      length_unit: 'cm',
      hide_billing_address: false,
      order_confirmation_copy_to: 'support@gametask.club',
    };
  }

  async getSettings() {
    const data = await settings.findOne({});
    if (data === null) {
      await settings.create(this.defaultSettings);
      const result = await this.getSettings();
      return result;
    }
    return data;
  }

  async updateSettings(data) {
    try {
      const resultValidation = await settings.validate(data);
      if (resultValidation === undefined) {
        await this.insertDefaultSettingsIfEmpty(); // if settings doesn't exist
        await settings.updateOne({}, { $set: data }, { upsert: true });
        return this.getSettings();
      }
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async changeProperties(settingsFromDB) {
    const data = Object.assign(this.defaultSettings, settingsFromDB, {
      _id: undefined,
    });
    if (data.domain === null || data.domain === undefined) {
      data.domain = '';
    }

    if (data.logo_file && data.logo_file.length > 0) {
      data.logo = url.resolve(data.domain, `${config.filesUploadUrl}/${data.logo_file}`);
    } else {
      data.logo = null;
    }
    return data;
  }

  async deleteLogo() {
    const data = this.getSettings();
    if (data.logo_file && data.logo_file.length > 0) {
      const filePath = path.resolve(`${config.filesUploadPath}/${data.logo_file}`);
      fs.unlink(filePath, () => {
        this.updateSettings({ logo_file: null });
      });
    }
  }

  getErrorMessage(err) {
    return { error: true, message: err.toString() };
  }

  async insertDefaultSettingsIfEmpty() {
    const countOfDocuments = await settings.countDocuments();
    if (countOfDocuments === 0) {
      const data = await settings.create(this.defaultSettings);
      return data;
    }
  }
}

export default new SettingsApi();
