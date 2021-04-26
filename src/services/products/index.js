import mongoose from 'mongoose';
import url from 'url';
import fse from 'fs-extra';
import path from 'path';
import logger from 'winston';
import models from '../models';
import config from '../../../config';
import SettingsApi from '../settings/settings';
import api from '../api';
import productsEffectData from '../../../config/productEffectsData.json';
import productsManufacturersData from '../../../config/productManufacturersData.json';
import formatters from '../../libs/formatters';

async function changeUpdatedObject(object) {
  if (object.effects) {
    object.effects.map((effect, index) => {
      const effectExist = productsEffectData.data.find(item => item.name === effect);
      if (effectExist) return effect;
      object.effects.splice(index, 1);
    });
  }
  if (object.manufacturer) {
    const manufacturer = productsManufacturersData.data.find(item => item === object.manufacturer);
    if (!manufacturer) delete object.manufacturer;
  }
  if (object.categoryId) {
    // if category have parent, add parent to category_ids
    const category = await api.categories.getSingleCategory(object.categoryId);
    const arrayIds = [];
    arrayIds.push(category._id);
    if (category.parent_id) {
      arrayIds.push(category.parent_id);
    }
    object.category_ids = arrayIds;
  }
  return object;
}

function formateFilter(object) {
  const defaultStart = 0;
  const defaultEnd = 99999;
  const filter = {};
  filter.price_range = { from: defaultStart, to: defaultEnd };
  filter.volleys_range = { from: defaultStart, to: defaultEnd };
  if (object.pricefrom || object.priceto) {
    filter.price_range.from = parseInt(object.pricefrom, 10) || defaultStart;
    filter.price_range.to = parseInt(object.priceto, 10) || defaultEnd;
    delete object.pricefrom;
    delete object.priceto;
  }

  if (object.volleysfrom || object.volleysto) {
    filter.volleys_range.from = parseInt(object.volleysfrom, 10) || defaultStart;
    filter.volleys_range.to = parseInt(object.volleysto, 10) || defaultEnd;
    delete object.volleysfrom;
    delete object.volleysto;
  }

  filter.data = { ...object };
  if (object.shops) {
    filter.data['shops.name'] = object.shops;
    delete filter.data.shops;
  }

  if (object.categoryId) {
    filter.data.category_ids = new mongoose.Types.ObjectId(object.categoryId);
    delete filter.data.categoryId;
  }

  return filter;
}

function filterByAvailabilityInTheShop(data, shopsName) {
  if (shopsName) {
    let index = 0;
    const countOfIterration = data.length;
    for (let i = 0; i < countOfIterration; i += 1) {
      const { shops } = data[index];
      // eslint-disable-next-line no-loop-func
      shops.forEach(shop => {
        let exist;
        if (Array.isArray(shopsName)) exist = shopsName.find(name => name === shop.name);
        else exist = shopsName;

        if (!exist || shop.quantity < 1) data.splice(index, 1);
        else index += 1;
      });
    }
  }
  return data;
}

const product = models.ProductModel;
const option = models.OptionModel;
const optionValue = models.OptionValueModel;
const variant = models.VariantModel;
const order = models.OrderModel;

class ProductApi {
  // start crud product
  async addProduct(object) {
    try {
      if (!object.slug) object.slug = formatters.getSlugFromString(object.name);
      const data = await product.create(object);
      if (!data) throw new Error('Something went wrong, check your fields');
      else {
        logger.info(`Product "${data.name}" was add in the db`);
        return data;
      }
    } catch (error) {
      logger.error(error.toString());
    }
  }

  /**
   * @param  {object} reqData { id: objectId, data: { ... }}
   * @param  {array} dataMap  [ [keys], [values] ]
   */
  async updateProduct(id, object) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `Ivalid identifier`;
    }
    try {
      object = await changeUpdatedObject(object);
      const data = await product.findOne({ _id: id });
      if (!data) throw new Error('Something went wrong');
      for (const [key, value] of Object.entries(object)) {
        if (value || value === 0) data[key] = value;
      }
      const updateData = await product.findByIdAndUpdate(data._id, data);
      if (!updateData) throw new Error('Something went wrong');
      else {
        logger.info(`Product "${data.name}" was updated`);
        return this.getProductById(id);
      }
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async deleteProduct(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return `Ivalid identifier`;
    }
    try {
      const result = await product.findByIdAndRemove(id);
      if (!result) throw new Error('Something went wrong');
      else {
        logger.info(`Product ${result.name} was removed`);
        return { status: 'ok' };
      }
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async getProductById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'invalid identifier';
    }
    try {
      const data = await product.findById(id);
      if (data.length === 0 || !data) return 'Something went wrong, invalid query';
      return data;
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async getProductList(object) {
    if (typeof object !== 'object') {
      return 'Invalid data';
    }
    const filter = formateFilter(object);
    try {
      let data = await product.find({
        ...filter.data,
        $or: [
          {
            price: {
              $gte: filter.price_range.from,
              $lte: filter.price_range.to,
            },
          },
          {
            stock_price: {
              $gte: filter.price_range.from,
              $lte: filter.price_range.to,
            },
          },
        ],
        volleys: { $gte: filter.volleys_range.from, $lte: filter.volleys_range.to },
      });
      data = filterByAvailabilityInTheShop(data, filter.data['shops.name']);
      if (data.length === 0 || !data) return "Something went wrong, product's not found";
      return data;
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async searchProductByText(searchString) {
    try {
      const tags = await api.productTags.getTags({ name: searchString });
      let data = null;
      if (tags && tags.length > 0) {
        data = await this.getProductList({ tags: tags[0]._id.toString(), enabled: true });
        return data;
      }
      data = await product.find({
        $text: {
          $search: searchString,
        },
        enabled: true,
      });

      if (data.length === 0 || !data) return 'Products not found';
      return data;
    } catch (error) {
      logger.error(error.toString());
    }
  }
  // end crud product

  // start options api
  async getOptions(productId) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return 'invalid identifier';
    }
    const data = await product.findById(productId);
    if (data && data.options && data.options.length > 0) {
      return data.options.sort((a, b) => a.position - b.position);
    }
    return [];
  }

  async getSingleOption(productId, optionId) {
    const data = await this.getOptions(productId);
    return data.find(item => item._id.equals(optionId));
  }

  async deleteOption(productId, optionId) {
    if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(optionId)) {
      return 'invalid identifier';
    }

    try {
      const productObject = await product.findById(productId);
      for (let i = 0; i < productObject.options.length; i += 1) {
        if (productObject.options[i]._id.equals(optionId)) {
          productObject.options.splice(i, 1);
        }
      }
      await product.findByIdAndUpdate(productId, { $set: { options: productObject.options } });
      return this.getProductById(productId);
    } catch (error) {
      logger.error(error.toString());
    }

    return this.getOptions(productId);
  }

  async addOption(productId, data) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return 'invalid identifier';
    }
    try {
      const resultOfValidate = await option.validate(data);
      const optionData = await option.create(data);
      if (resultOfValidate === undefined) {
        await product.findOneAndUpdate(
          { _id: productId },
          {
            $push: { options: optionData },
          },
        );
        return this.getOptions(productId);
      }
    } catch (error) {
      return error;
    }
  }

  async updateOption(productId, optionId, data) {
    if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(optionId)) {
      return 'Invalid identifier';
    }

    try {
      const resultOfValidate = await option.validate(data);
      if (resultOfValidate === undefined) {
        const productObject = await product.findById(productId);
        const updateOptions = productObject.options.map(item => {
          if (item._id.equals(optionId)) {
            item.name = data.name;
            item.values = data.values;
            return item;
          }
          return item;
        });
        await product.findOneAndUpdate(
          {
            _id: productId,
          },
          { $set: { options: updateOptions } },
        );
        return this.getOptions(productId);
      }
    } catch (error) {
      logger.error(error.toString());
    }
  }

  changeProperties(item) {
    if (item) {
      if (item.id) {
        item.id = item.id.toString();
      }

      if (item.values && item.values.length > 0) {
        item.values = item.values.map(value => {
          value.id = value.id.toString();
          return value;
        });
      }
    }
    return item;
  }
  // end options api

  // start optionsValues api
  async addOptionValue(productId, optionId, data) {
    if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(optionId)) {
      return 'Invalid identifier';
    }

    try {
      const resultOfValidate = await optionValue.validate(data);
      if (resultOfValidate === undefined) {
        const valueObject = await optionValue.create(data);
        const productObject = await product.findById(productId);
        productObject.options.map(item => {
          if (item._id.equals(optionId)) {
            if (item.values) item.values.push(valueObject);
            else item.values = [valueObject];
          }
        });
        await product.findOneAndUpdate(
          {
            _id: productObject._id,
          },
          { options: productObject.options },
        );
        return this.getOptionValues(productId, optionId);
      }
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async getOptionValues(productId, optionId) {
    const data = await product.findById(productId);
    let optionObject;
    data.options.forEach(item => {
      if (item._id.equals(optionId)) optionObject = item;
    });
    if (optionObject && optionObject.values.length > 0) {
      return optionObject.values;
    }
    return [];
  }

  async getSingleOptionValue(productId, optionId, valueId) {
    const data = await this.getOptionValues(productId, optionId);
    return data.find(value => value._id.equals(valueId));
  }

  async updateOptionValue(productId, optionId, valueId, data) {
    if (
      !mongoose.Types.ObjectId.isValid(productId) ||
      !mongoose.Types.ObjectId.isValid(optionId) ||
      !mongoose.Types.ObjectId.isValid(valueId)
    )
      return 'Invalid identifier';

    if (data.name !== undefined) {
      const modifiedOptionValues = await this.getModifiedOptionValues(
        productId,
        optionId,
        valueId,
        data.name,
      );
      await this.overwriteAllValuesOption(productId, optionId, modifiedOptionValues);
      return this.getSingleOptionValue(productId, optionId, valueId);
    }
    return 'Please, specify value name';
  }

  async deleteOptionValue(productId, optionId, valueId) {
    if (
      !mongoose.Types.ObjectId.isValid(productId) ||
      !mongoose.Types.ObjectId.isValid(optionId) ||
      !mongoose.Types.ObjectId.isValid(valueId)
    )
      return 'Invalid identifier';

    const newOptionValues = await this.getOptionValuesWithDeletedOne(productId, optionId, valueId);
    await this.overwriteAllValuesOption(productId, optionId, newOptionValues);
    return this.getOptionValues(productId, optionId);
  }

  async getModifiedOptionValues(productId, optionId, valueId, name) {
    const optionValues = await this.getOptionValues(productId, optionId);
    if (optionValues && optionValues.length > 0) {
      const result = optionValues.map(item => {
        if (item._id.equals(valueId)) {
          item.name = name;
          return item;
        }
        return item;
      });
      return result;
    }
  }

  async overwriteAllValuesOption(productId, optionId, values) {
    if (values) {
      const object = await product.findOne({ _id: productId });
      object.options.map(item => {
        if (item._id.equals(optionId)) {
          item.values = values;
        }
      });
      const result = await product.findOneAndUpdate(
        { _id: productId },
        {
          options: object.options,
        },
      );
      return result;
    }
  }

  async getOptionValuesWithDeletedOne(productId, optionId, deleteValueId) {
    let optionValues = await this.getOptionValues(productId, optionId);
    if (optionValues && optionValues.length > 0) {
      optionValues = optionValues.filter(value => !value._id.equals(deleteValueId));
    }
    return optionValues;
  }
  // end optionsValues api

  // start productVariants
  async addVariant(productId, data) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return 'Invalid identifier';
    }
    try {
      const resultOfValidate = await variant.validate(data);
      const variantData = await variant.create(data);
      if (resultOfValidate === undefined) {
        await product.findByIdAndUpdate(productId, {
          $push: { variants: variantData },
        });
        return await this.getVariants(productId);
      }
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async deleteVariant(productId, variantId) {
    if (
      !mongoose.Types.ObjectId.isValid(productId) ||
      !mongoose.Types.ObjectId.isValid(variantId)
    ) {
      return 'Invalid identifier';
    }

    await product.findOneAndUpdate(
      { _id: productId },
      {
        $pull: {
          variants: {
            _id: variantId,
          },
        },
      },
    );
    return this.getVariants(productId);
  }

  async updateVariant(productId, variantId, data) {
    if (
      !mongoose.Types.ObjectId.isValid(productId) ||
      !mongoose.Types.ObjectId.isValid(variantId)
    ) {
      return 'Invalid identifier';
    }

    try {
      const resultOfValidate = await variant.validate(data);
      if (resultOfValidate === undefined) {
        const productObject = await product.findById(productId);
        productObject.variants.forEach(item => {
          if (item._id.equals(variantId)) {
            for (const key in data) {
              if (Object.prototype.hasOwnProperty.call(data, key)) item[key] = data[key];
            }
          }
        });
        await product.findByIdAndUpdate(productId, {
          variants: productObject.variants,
        });
        return await this.getVariants(productId);
      }
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async getVariants(productId) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return 'Invalid identifier';
    }

    const productObject = await product.findById(productId);
    return productObject.variants || [];
  }

  async getVariantOptions(productId, variantId) {
    if (
      !mongoose.Types.ObjectId.isValid(productId) ||
      !mongoose.Types.ObjectId.isValid(variantId)
    ) {
      return 'Invalid identifier';
    }
    let variantObject;

    const productObject = await product.findById(productId);
    if (productObject && productObject.variants && productObject.variants.length > 0) {
      variantObject = productObject.variants.find(item => item._id.equals(variantId));
    }
    if (variantObject && variantObject.options.length > 0) {
      return variantObject.options;
    }
    return [];
  }

  async getModifiedVariantOptions(productId, variantId, optionId, valueId) {
    let variantOptions = await this.getVariantOptions(productId, variantId);
    if (variantOptions && variantOptions.length > 0) {
      const optionToChange = variantOptions.find(item => item._id.equals(optionId));

      if (optionToChange === undefined) {
        // if option not exist => add new option
        variantOptions.push({
          option_id: new mongoose.Types.ObjectId(optionId),
          value_id: new mongoose.Types.ObjectId(valueId),
        });
      } else {
        // if option exist => set new valueId

        if (optionToChange.value_id.equals(valueId)) {
          // don't save same value
          return variantOptions;
        }

        variantOptions = variantOptions.map(item => {
          if (item.option_id.equals(optionId)) {
            item.value_id = new mongoose.Types.ObjectId(valueId);
            return item;
          }
          return item;
        });
      }
    } else {
      variantOptions = [];
      variantOptions.push({
        option_id: new mongoose.Types.ObjectId(optionId),
        value_id: new mongoose.Types.ObjectId(valueId),
      });
    }

    return variantOptions;
  }

  async setVariantOptions(productId, variantId, data) {
    if (
      !mongoose.Types.ObjectId.isValid(productId) ||
      !mongoose.Types.ObjectId.isValid(variantId) ||
      !mongoose.Types.ObjectId.isValid(data.option_id) ||
      !mongoose.Types.ObjectId.isValid(data.value_id)
    ) {
      return 'Invalid identifier';
    }

    const modifiedVariantOptions = await this.getModifiedVariantOptions(
      productId,
      variantId,
      data.option_id,
      data.value_id,
    );
    const productObject = await this.getProductById(productId);

    if (productObject.variants) {
      productObject.variants.forEach(item => {
        if (item._id.equals(variantId)) {
          item.options = modifiedVariantOptions;
        }
      });
      await this.updateProduct(productId, { variants: productObject.variants });
    }
    return this.getVariants(productId);
  }
  // end productVariants

  // start product shops
  async addShop(productId, data) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return 'Invalid identifier';
    }
    const shop = await api.shops.getShopById(data.shop_id);
    const shopObject = {
      _id: new mongoose.Types.ObjectId(),
      shop_id: data.shop_id,
      name: shop.name,
      quantity: data.quantity,
      warehouse: shop.warehouse,
    };
    await product.findByIdAndUpdate(productId, { $push: { shops: shopObject } });
    const updateProduct = await product.findById(productId);
    return updateProduct.shops;
  }

  async deleteShop(productId, shopId) {
    if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(shopId)) {
      return 'Invalid identifier';
    }
    const productObject = await product.findById(productId);
    productObject.shops.map((item, index) => {
      if (item._id.equals(shopId)) {
        productObject.shops.splice(index, 1);
      }
    });
    try {
      await product.findByIdAndUpdate(productId, { $set: { shops: productObject.shops } });
      const updateProduct = await product.findById(productId);
      return updateProduct.shops;
    } catch (error) {
      return { status: false, message: `${error}` };
    }
  }

  async updateShop(productId, shopId, data) {
    if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(shopId)) {
      return 'Invalid identifier';
    }
    const productObject = await product.findById(productId);
    const newArray = productObject.shops.map(item => {
      if (item._id.equals(shopId)) {
        item.name = data.name;
        item.quantity = data.quantity;
        return item;
      }
      return item;
    });
    try {
      await product.findByIdAndUpdate(productId, { $set: { shops: newArray } });
      const updateProduct = await product.findById(productId);
      return updateProduct.shops;
    } catch (error) {
      return { status: false, message: `${error}` };
    }
  }

  // end product shops

  // start productImage
  async getErrorMessage(err) {
    return { error: true, messsage: err.toString() };
  }

  async getImages(productId) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return 'Invalid identifier';
    }

    try {
      const currentSettings = await SettingsApi.getSettings();
      const currentProduct = await product.findById(productId);
      if (currentProduct && currentProduct.images && currentProduct.images.length > 0) {
        let images = currentProduct.images.map(image => {
          image.url = url.resolve(
            currentSettings.domain,
            `${config.productsUploadUrl}/${currentProduct._id}/${image.filename}`,
          );
          return image;
        });
        images = images.sort((a, b) => a.position - b.position);
        return images;
      }
      return [];
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async deleteImage(productId, imageId) {
    if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(imageId)) {
      return 'Invalid identifier';
    }

    try {
      const images = await this.getImages(productId);
      if (images && images.length > 0) {
        const imageData = images.find(i => i._id.equals(imageId));
        if (imageData) {
          const { filename } = imageData;
          const filePath = path.resolve(`${config.productsUploadPath}/${productId}/${filename}`);
          await fse.remove(filePath);
          const productObject = await product.findById(productId);
          productObject.images.map((item, index) => {
            if (item._id.equals(imageId)) {
              productObject.images.splice(index, 1);
            }
          });
          await product.findByIdAndUpdate(productId, { $set: { images: productObject.images } });
          return true;
        }
        return true;
      }
      return true;
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async addImage(ctx, productId) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      ctx.status = 500;
      ctx.body = this.getErrorMessage('Invalid identifier');
      return;
    }

    const requestFile = ctx.request.files.file;
    const uploadDir = path.resolve(`${config.productsUploadPath}/${productId}`);
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
      position: 99,
      filename: requestFile.name,
    };
    await product.findByIdAndUpdate(productId, {
      $push: { images: imageData },
    });
    return { status: 'success' };
  }

  async updateImage(productId, imageId, data) {
    if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(imageId)) {
      return 'Invalid identifier';
    }
    const productObject = await product.findById(productId);
    productObject.images.map(item => {
      if (item._id.equals(imageId)) {
        item.alt = data.alt;
      }
    });
    try {
      const updateData = await product.findByIdAndUpdate(productId, {
        $set: { images: productObject.images },
      });
      return updateData;
    } catch (error) {
      logger.error(error.toString());
    }
  }
  // end productImage

  // start productFiles
  async getFiles(productId) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return 'Invalid identifier';
    }

    try {
      const currentSettings = await SettingsApi.getSettings();
      const currentProduct = await product.findById(productId);
      if (currentProduct && currentProduct.files && currentProduct.files.length > 0) {
        let files = currentProduct.files.map(file => {
          file.url = url.resolve(
            currentSettings.domain,
            `${config.productsFilesUploadUrl}/${currentProduct._id}/${file.filename}`,
          );
          return file;
        });
        files = files.sort((a, b) => a.position - b.position);
        return files;
      }
      return [];
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async deleteFile(productId, fileId) {
    if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(fileId)) {
      return 'Invalid identifier';
    }

    try {
      const files = await this.getFiles(productId);
      if (files && files.length > 0) {
        const fileData = files.find(i => i._id.equals(fileId));
        if (fileData) {
          const { filename } = fileData;
          const filePath = path.resolve(
            `${config.productsFilesUploadPath}/${productId}/${filename}`,
          );
          await fse.remove(filePath);
          const productObject = await product.findById(productId);
          productObject.files.map((item, index) => {
            if (item._id.equals(fileId)) {
              productObject.files.splice(index, 1);
            }
          });
          await product.findByIdAndUpdate(productId, { $set: { files: productObject.files } });
          return true;
        }
        return true;
      }
      return true;
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async addFile(ctx, productId) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      ctx.status = 500;
      ctx.body = this.getErrorMessage('Invalid identifier');
      return;
    }

    const requestFile = ctx.request.files.file;
    const uploadDir = path.resolve(`${config.productsFilesUploadPath}/${productId}`);
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
    const fileData = {
      _id: new mongoose.Types.ObjectId(),
      filename: requestFile.name,
    };
    await product.findByIdAndUpdate(productId, {
      $push: { files: fileData },
    });
    return { status: 'success' };
  }

  // end productFiles

  // start productStock
  async handleOrderCheckout(orderId, shopId) {
    const object = await this.getOrder(orderId);
    if (object && object.length > 0) {
      for (const item of object) {
        await this.decrementStockQuantity(item.product_id, item.variant_id, item.quantity, shopId);
      }
    }
  }

  async handleCancelOrder(orderId) {
    const object = await this.getOrder(orderId);
    if (object && object.length > 0) {
      for (const item of object) {
        await this.incrementStockQuantity(item.product_id, item.variant_id, item.quantity);
      }
    }
  }

  async handleAddOrderItem(orderId, itemId) {
    const item = await this.getOrderItem(orderId, itemId);
    if (item) {
      await this.decrementStockQuantity(item.product_id, item.variant_id, item.quantity);
    }
  }

  async handleDeleteOrderItem(orderId, itemId) {
    const item = await this.getOrderItem(orderId, itemId);
    if (item) {
      await this.incrementStockQuantity(item.product_id, item.variant_id, item.quantity);
    }
  }

  async incrementStockQuantity(productId, variantId, quantity, shopId) {
    await this.changeStockQuantity(productId, variantId, quantity, shopId);
  }

  async decrementStockQuantity(productId, variantId, quantity, shopId) {
    await this.changeStockQuantity(productId, variantId, quantity * -1, shopId);
  }

  async changeStockQuantity(productId, variantId, quantity, shopId) {
    const currentProduct = await this.getProductById(productId);
    if (currentProduct && this.isStockTrackingEnabled(currentProduct) && shopId) {
      // change product quantity
      currentProduct.shops.map(item => {
        if (item._id.equals(shopId)) {
          item.quantity += quantity;
        }
      });

      await this.updateProduct(productId, {
        shops: currentProduct.shops,
      });

      if (this.isVariant(variantId)) {
        // change variant stock quantity
        const variantQuantity = this.getVariantQuantityFromProduct(currentProduct, variantId);
        const newVariantQuantity = variantQuantity + quantity;
        await this.updateVariant(productId, variantId, {
          stock_quantity: newVariantQuantity,
        });
      }
    }
  }

  getVariantQuantityFromProduct(productObject, variantId) {
    const { variants } = productObject;
    if (variants && variants.length > 0) {
      const variantObject = variants.find(v => v._id.equals(variantId));
      if (variantObject) {
        return variantObject.stock_quantity || 0;
      }
    }
    return 0;
  }

  isVariant(variantId) {
    return variantId && variantId !== '';
  }

  isStockTrackingEnabled(productObject) {
    return productObject.stock_tracking === true;
  }

  async getOrder(orderId) {
    const filter = {
      _id: orderId,
      draft: false,
    };

    const object = await order.find(filter);
    return object;
  }

  async getOrderItem(orderId, itemId) {
    const orders = await this.getOrder(orderId);
    const object = orders[0];
    if (object && object.items.length > 0) {
      return object.items.find(item => item._id.equals(itemId));
    }
    return null;
  }

  // end productStock
}

const productApi = new ProductApi();

export default productApi;
