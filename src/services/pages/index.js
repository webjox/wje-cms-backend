import url from 'url';
import { Types } from 'mongoose';
import logger from 'winston';
import path from 'path';
import fse from 'fs-extra';
import utils from '../../libs/utils';
import parse from '../../libs/parse';
import config from '../../../config';
import models from '../models';
import api from '../api';
import formatters from '../../libs/formatters';

const { PageModel } = models;

const DEFAULT_SORT = { is_system: -1, date_created: 1 };

class PageApi {
  getFilter(params = {}) {
    const filter = {};
    const tags = parse.getString(params.tags);
    if (Types.ObjectId.isValid(params._id)) {
      filter._id = params._id;
    }
    if (tags && tags.length > 0) {
      filter.tags = tags;
    }
    return filter;
  }

  getSortQuery({ sort }) {
    if (sort && sort.length > 0) {
      const fields = sort.split(',');
      return Object.assign(
        ...fields.map(field => ({
          [field.startsWith('-') ? field.slice(1) : field]: field.startsWith('-') ? -1 : 1,
        })),
      );
    }
    return DEFAULT_SORT;
  }

  async getPages(params = {}) {
    const filter = this.getFilter(params);
    const sortQuery = this.getSortQuery(params);
    const projection = utils.getProjectionFromFields(params.fields);
    const items = PageModel.find(filter, projection).sort(sortQuery);

    for (let i = 0; i < items.length; i += 1) {
      items[i] = await this.changeProperties(items[i]);
    }
    return items;
  }

  async getSinglePage(id) {
    if (!Types.ObjectId.isValid(id)) {
      return `Invalid identifier`;
    }
    const page = await PageModel.findById(id);
    const result = await this.changeProperties(page);
    return result;
  }

  async addPage(data) {
    try {
      if (!data.slug) data.slug = formatters.getSlugFromString(data.name);
      return await PageModel.create(data);
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async updatePage(id, data) {
    if (!Types.ObjectId.isValid(id)) {
      return `Invalid identifier`;
    }

    try {
      await PageModel.findByIdAndUpdate(id, data);
      const result = await this.getSinglePage(id);
      return result;
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async deletePage(id) {
    if (!Types.ObjectId.isValid(id)) {
      return `Invalid identifier`;
    }

    try {
      await PageModel.findByIdAndDelete(id);
      return { status: 'success' };
    } catch (error) {
      logger.error(error.toString());
      return { status: 'error', message: error.toString() };
    }
  }

  async uploadCardImage(id, file) {
    if (!Types.ObjectId.isValid(id)) {
      return `Invalid identifier`;
    }

    const uploadDir = path.resolve(`${config.pagesUploadPath}/${id}`);

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
      _id: new Types.ObjectId(),
      alt: '',
      position: 99,
      filename: file.name,
    };

    await this.updatePage(id, { card_image: imageData });
    return { status: 'success' };
  }

  async getCardImage(id) {
    if (!Types.ObjectId.isValid(id)) {
      return `Invalid identifier`;
    }

    try {
      const currentSettings = await api.settings.getSettings();
      const currentPage = await this.getSinglePage(id);
      if (currentPage && currentPage.image) {
        currentPage.image.url = url.resolve(
          currentSettings.domain,
          `${config.pagesUploadUrl}/${currentPage._id}/${currentPage.image.filename}`,
        );
        return currentPage.image;
      }
      return 'image not found';
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async updateCardImage(id, data) {
    if (!Types.ObjectId.isValid(id)) {
      return `Invalid identifier`;
    }
    const page = await this.getSinglePage(id);
    page.card_image.alt = data.alt;
    const result = await this.updatePage(id, { card_image: page.card_image });
    return result;
  }

  async deleteCardImage(id) {
    if (!Types.ObjectId.isValid(id)) {
      return `Invalid identifier`;
    }

    const page = await this.getSinglePage(id);
    const { filename } = page.card_image;
    const filePath = path.resolve(`${config.pagesUploadPath}/${id}/${filename}`);
    await fse.remove(filePath);
    const result = await this.updatePage(id, { card_image: null });
    return result;
  }

  async changeProperties(item) {
    if (item) {
      if (!item.slug) {
        item.slug = '';
      }

      const currentSettings = await api.settings.getSettings();
      const { domain } = currentSettings;
      if (item.card_image) {
        const imageUrl = url.resolve(
          domain,
          `${config.pagesUploadUrl}/${item._id}/${item.card_image.filename}`,
        );

        item.card_image.url = imageUrl;

        item.url = url.resolve(domain, `/${item.slug}`);
        item.path = url.resolve('/', item.slug);
      }
    }

    return item;
  }
}

export default new PageApi();
