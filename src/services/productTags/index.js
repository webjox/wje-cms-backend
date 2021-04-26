import { Types } from 'mongoose';
import models from '../models';

const { ProductTagModel } = models;

class ProductTagApi {
  async createTag(data) {
    try {
      const result = await ProductTagModel.create(data);
      return result;
    } catch (error) {
      return { status: 'error', message: `${error}` };
    }
  }

  async getTags(filter = {}) {
    const result = await ProductTagModel.find(filter);
    return result;
  }

  async getTagById(id) {
    if (!Types.ObjectId.isValid(id)) {
      return 'Invalid identifier';
    }
    const result = await ProductTagModel.findById(id);
    return result;
  }

  async updateTag(id, data) {
    if (!Types.ObjectId.isValid(id)) {
      return 'Invalid identifier';
    }
    try {
      await ProductTagModel.findByIdAndUpdate(id, data);
      return await this.getTagById(id);
    } catch (error) {
      return { status: 'error', message: `${error}` };
    }
  }

  async deleteTag(id) {
    if (!Types.ObjectId.isValid(id)) {
      return 'Invalid identifier';
    }
    try {
      await ProductTagModel.findByIdAndDelete(id);
      // remove tag from all products after deleting tag
      const products = await models.ProductModel.find({ tags: id });
      if (products.length > 0) {
        products.map(product => {
          product.tags.map(async (tag, index) => {
            if (tag._id.equals(id)) {
              product.tags.splice(index, 1);
              await models.ProductModel.findByIdAndUpdate(product._id, {
                tags: product.tags,
              });
            }
          });
        });
      }
      return { status: 'success' };
    } catch (error) {
      return { status: 'error', message: `${error}` };
    }
  }
}

export default new ProductTagApi();
