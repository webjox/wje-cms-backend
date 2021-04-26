import mongoose from 'mongoose';
import path from 'path';
import url from 'url';
import fse from 'fs-extra';
import logger from 'winston';
import parse from '../../libs/parse';
import utils from '../../libs/utils';
import settings from '../settings/settings';
import config from '../../../config';
import models from '../models';
import formatters from '../../libs/formatters';
import api from '../api';

const category = models.CategoryModel;
const { ProductModel } = models;

class CategoriesApi {
  getFilter(params = {}) {
    const filter = {};
    const enabled = parse.getBooleanIfValid(params.enabled);
    if (enabled !== null) filter.enabled = enabled;
    if (params._id) filter._id = params._id;
    if (params.parent_id) filter.parent_id = params.parent_id;
    return filter;
  }

  async getCategories(params = {}) {
    const filter = this.getFilter(params);
    const generalSettings = await settings.getSettings();
    const { domain } = generalSettings;
    const items = await category.find(filter).sort({ postion: 1 });
    const result = items.map(item => {
      return this.changeProperties(item, domain);
    });
    return result;
  }

  async getSingleCategory(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Invalid identifier';
    }

    try {
      const categories = await this.getCategories({ _id: id });
      if (categories.length > 0) return categories[0];
      return null;
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async addCategory(data) {
    try {
      const lastCategory = await category.findOne({}).sort({ position: -1 });
      const newPosition = lastCategory && lastCategory.position > 0 ? lastCategory.position + 1 : 1;
      const dataToInsert = await this.getValidDocumentForInsert(data, newPosition);
      const InsertResult = await category.insertMany([dataToInsert]);
      return this.getSingleCategory(InsertResult[0]._id);
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async updateProductCategories(categoryId) {
    const products = await api.products.getProductList({ categoryId });
    products.map(async item => {
      await api.products.updateProduct(item._id, { categoryId });
    });
  }

  async updateCategory(id, data) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Invalid identifier';
    }
    try {
      const validData = await this.getValidDocumentForUpdate(data, id);
      await category.findByIdAndUpdate(id, validData);
      if (validData.parent_id) {
        await this.updateProductCategories(id);
      }
      const result = await this.getSingleCategory(id);
      return result;
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async findAllChildren(items, id, result) {
    if (id && mongoose.Types.ObjectId.isValid(id)) {
      result.push(new mongoose.Types.ObjectId(id));
      const finded = items.filter(item => (item.parent_id || '').toString() === id.toString());
      if (finded.length > 0) {
        for (const item of finded) {
          this.findAllChildren(items, item._id, result);
        }
      }
    }
    return result;
  }

  async deleteCategory(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Invalid identifier';
    }

    const categories = await this.getCategories();
    let idsToDelete = [];
    idsToDelete = await this.findAllChildren(categories, id, idsToDelete);
    const resultOfDelete = await category.deleteMany({ _id: { $in: idsToDelete } });
    idsToDelete = resultOfDelete.deletedCount > 0 ? idsToDelete : null;

    if (idsToDelete) {
      // update category_id for products;
      await ProductModel.updateMany(
        { category_id: { $in: idsToDelete } },
        { $set: { category_id: null } },
      );

      // delete directories with images
      for (const categoryId of idsToDelete) {
        const deleteDir = path.resolve(`${config.categoriesUploadPath}/${categoryId}`);
        fse.remove(deleteDir);
      }
      return true;
    }
    return false;
  }

  getErrorMessage(err) {
    return { error: true, message: err.toString() };
  }

  async deleteCategoryImage(categoryId) {
    const deleteDir = path.resolve(`${config.categoriesUploadPath}/${categoryId}`);
    await fse.emptyDir(deleteDir);
    await this.updateCategory(categoryId, { image: '' });
    return { status: 'success' };
  }

  async getCategoryImage(categoryId) {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return 'Invalid identifier';
    }

    try {
      const currentSettings = await settings.getSettings();
      const currentCategory = await category.findById(categoryId);
      if (currentCategory && currentCategory.image) {
        currentCategory.image.url = url.resolve(
          currentSettings.domain,
          `${config.categoriesUploadUrl}/${currentCategory._id}/${currentCategory.image.filename}`,
        );
        return currentCategory.image;
      }
      return '';
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async updateCategoryImage(categoryId, data) {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return 'Invalid identifier';
    }

    const categoryObject = await category.findById(categoryId);
    categoryObject.image.alt = data.alt;
    await category.findByIdAndUpdate(categoryId, { image: categoryObject.image });
    return { status: 'success' };
  }

  async uploadCategoryImage(requestFile, categoryId) {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return this.getErrorMessage('Invalid identifier');
    }

    const uploadDir = path.resolve(`${config.categoriesUploadPath}/${categoryId}`);
    // create dir, if it doesn't exist
    try {
      await fse.ensureDir(uploadDir);
    } catch (error) {
      logger.error(error.toString());
    }
    // move file with new name to product dir
    try {
      await fse.rename(requestFile.path, `${uploadDir}/${requestFile.name}`);
    } catch (error) {
      logger.error(error.toString());
    }
    //
    const imageData = {
      _id: new mongoose.Types.ObjectId(),
      alt: '',
      filename: requestFile.name,
    };
    try {
      await this.updateCategory(categoryId, { image: imageData });
    } catch (error) {
      logger.error(error.toString());
      return error;
    }
    return { status: 'success' };
  }

  async getValidDocumentForUpdate(data, id) {
    if (Object.keys(data).length === 0) {
      return 'Required fields are missing';
    }
    if (data.slug !== undefined) {
      let { slug } = data;
      if (!slug || slug.length === 0) {
        slug = data.name;
      }

      const validSlug = await utils.getAvailableSlug(slug, id);
      if (validSlug) data.slug = validSlug;
    }
    return data;
  }

  async getValidDocumentForInsert(data, newPosition) {
    const categoryObject = { ...data };
    categoryObject.position = data.position || newPosition;
    if (!categoryObject.slug || categoryObject.slug.length === 0) {
      categoryObject.slug = formatters.getSlugFromString(categoryObject.name);
    }
    return categoryObject;
  }

  changeProperties(item, domain) {
    if (item) {
      if (item.slug) {
        item.url = url.resolve(domain, `/${item.slug}`);
        item.path = url.resolve('/', item.slug);
      }

      if (item.image) {
        item.imgae = url.resolve(
          domain,
          `${config.categoriesUploadUrl}/${item._id.toString()}/${item.image}`,
        );
      }
    }

    return item;
  }
}

export default new CategoriesApi();
