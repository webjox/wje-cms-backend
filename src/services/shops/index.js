import logger from 'winston';
import { Types } from 'mongoose';
import path from 'path';
import url from 'url';
import fse from 'fs-extra';
import api from '../api';
import config from '../../../config';
import models from '../models';

const shop = models.ShopModel;

class ShopsApi {
  async addShop(data = {}) {
    try {
      const result = await shop.create(data);
      logger.info(`Shop ${result.name} was added in db`);
      return result;
    } catch (error) {
      logger.error(error);
    }
  }

  async updateShop(id, data) {
    if (!Types.ObjectId.isValid(id)) {
      return `Invalid identifier`;
    }

    try {
      await shop.findByIdAndUpdate(id, data);
      const result = await shop.findById(id);
      return result;
    } catch (error) {
      logger.error(error);
    }
  }

  async getShops() {
    const shops = await shop.find({});
    const currentSettings = await api.settings.getSettings();
    const result = shops.map(item => {
      const image = this.getImage(item, currentSettings.domain);
      if (typeof image === 'object') item.image = image;
      return item;
    });
    return result;
  }

  async getShopById(id) {
    if (!Types.ObjectId.isValid(id)) {
      return `Invalid identifier`;
    }
    const currentSettings = await api.settings.getSettings();
    const object = await shop.findById(id);
    const image = this.getImage(object, currentSettings.domain);
    if (typeof image === 'object') object.image = image;
    return object;
  }

  async deleteShop(id) {
    if (!Types.ObjectId.isValid(id)) {
      return `Invalid identifier`;
    }
    try {
      // clear all products from this shop
      await models.ProductModel.updateMany({}, { $pull: { shops: { shop_id: id } } });
      await shop.findByIdAndRemove(id);
      return { status: 'success' };
    } catch (error) {
      logger.error(error);
      return { status: 'error', error: error.toString() };
    }
  }

  async addImage(id, file) {
    if (!Types.ObjectId.isValid(id)) {
      return `Invalid identifier`;
    }

    const uploadDir = path.resolve(`${config.shopsUploadPath}/${id}`);
    // create dir, if it doesn't exist
    try {
      await fse.ensureDir(uploadDir);
    } catch (error) {
      logger.error(error.toString());
    }

    // move file with new name to product dir
    try {
      await fse.rename(file.path, `${uploadDir}/${file.name}`);
    } catch (error) {
      logger.error(error.toString());
    }

    const imageData = {
      alt: '',
      filename: file.name,
    };

    await this.updateShop(id, { image: imageData });
    return { status: 'success' };
  }

  getImage(item, domain) {
    try {
      const currentShop = item;
      if (currentShop && currentShop.image) {
        currentShop.image.url = url.resolve(
          domain,
          `${config.shopsUploadUrl}/${currentShop._id}/${currentShop.image.filename}`,
        );
        return currentShop.image;
      }
      return 'image not found';
    } catch (error) {
      logger.error(error);
    }
  }

  async updateImage(id, data) {
    if (!Types.ObjectId.isValid(id)) {
      return `Invalid identifier`;
    }
    const shopObject = await this.getShopById(id);
    shopObject.image.alt = data.alt;
    const result = await this.updateShop(id, { image: shopObject.image });
    return result;
  }

  async deleteImage(id) {
    if (!Types.ObjectId.isValid(id)) {
      return `Invalid identifier`;
    }

    const shopObject = await this.getShopById(id);
    const { filename } = shopObject.image;
    const filePath = path.resolve(`${config.shopsUploadPath}/${id}/${filename}`);
    await fse.remove(filePath);
    const result = await this.updateShop(id, { card_image: null });
    return result;
  }

  async changeProperties(shops) {
    const currentSettings = await api.settings.getSettings();
    let result;
    if (Array.isArray(shops)) {
      result = shops.map(item => {
        item.image = this.getImage(item, currentSettings.domain);
        return item;
      });
      return result;
    }
    result = shops;
    result.image = this.getImage(result, currentSettings.domain);
    return result;
  }
}

export default new ShopsApi();
