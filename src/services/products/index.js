import mongoose from 'mongoose';
import colors from 'colors';
import SettingsApi from '../settings/settings';
import url from 'url';
import config from '../../../config';
import fse from 'fs-extra';
import path from 'path';
import formidable from 'formidable';
import utils from '../../libs/utils';
import models from '../models';
import logger from 'winston';

const product = models.productModel;
const option = models.optionModel;
const optionValue = models.optionValueModel;
const variant = models.variantModel;
const order = models.orderModel;

class ProductApi {
    constructor() {};

    // start crud product
    async addProduct(object) {
        try {
            const data = await product.create(object);
            if(!data) throw new Error('Something went wrong, check your fields')
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
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return `Ivalid identifier`;
        }
        try {
           const data = await product.findOne({_id: id});
           if(!data) throw new Error('Something went wrong');
           for (const [key, value] of Object.entries(object)) {
               if(value || value === 0) data[key] = value;
           }
           const updateData = await product.findByIdAndUpdate(data._id, data);
           if(!updateData) throw new Error('Something went wrong');
           else logger.info(`Product "${data.name}" was updated`)
        } catch (error) {
            logger.error(error.toString());
        }
    }

    async deleteProduct(id) {
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return `Ivalid identifier`;
        }
        try {
            const result = await product.findByIdAndRemove(id);
            if(!result) throw new Error('Something went wrong');
            else logger.info(`Product ${result.name} was removed`);
        } catch (error) {
            logger.error(error.toString());
        }
    }    

    async getProductById(id) {
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return 'invalid identifier';
        }
        try {
            const data = await product.findById(id);
            if(data.length === 0 || !data) return 'Something went wrong, invalid query';
            else return data;
        } catch (error) {
            logger.error(error.toString());
        }
    }

    async getProductList(object) {
        if(typeof(object) !== 'object') {
            return 'Invalid data'
        }
        try {
            const data = await product.find(object);
            if(data.length === 0 || !data) return 'Something went wrong, invalid query';
            else return data;
        } catch (error) {
            logger.error(error.toString());
        }
    }
    // end crud product

    // start options api
    async getOptions(productId) {
        if(!mongoose.Types.ObjectId.isValid(productId)) {
            return 'invalid identifier';
        }
        const data = await product.findById(productId);
        if(data && data.options && data.options.length > 0) {
            return data.options.sort((a, b) => a.position - b.position);
        } else return [];
    }

    async getSingleOption(productId, optionId) {
        const data = await this.getOptions(productId);
        return data.find(option => option.id === optionId);
    }

    async deleteOption(productId, optionId) {
        if(!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(optionId)) {
            return 'invalid identifier';
        }

        try {
            const productObject = await product.findById(productId);
            for(let i = 0; i < productObject.options.length; i++) {
                if(productObject.options[i]._id.equals(optionId)) {
                    productObject.options.splice(i, 1);
                }
            }
            await product.findByIdAndUpdate(productId, { $set: { options: productObject.options }});
        } catch (error) {
            logger.error(error.toString());
        }

        return this.getOptions(productId);
    }

    async addOption(productId, data) {
        if(!mongoose.Types.ObjectId.isValid(productId)) {
            return 'invalid identifier';
        }
        try {
            const resultOfValidate = await option.validate(data);
            const optionData = await option.create(data);
            if(resultOfValidate === undefined) {
                await product.findOneAndUpdate({_id: productId}, {
                    $push: { options: optionData }
                })
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
            if(resultOfValidate === undefined) {
                const productObject = await product.findById(productId);
                const updateOptions = productObject.options.map(item => {
                    if(item._id.equals(optionId)) {
                        item.name = data.name;
                        item.values = data.values;
                        return item;
                    } else {
                        return item;
                    }
                })
                await product.findOneAndUpdate({
                    _id: productId,
                }, { $set: {options: updateOptions} });
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
            const valueObject = await optionValue.create(data);
            if(resultOfValidate === undefined) {
                const productObject = await product.findById(productId);
                productObject.options.map((item, index) => {
                    if(item._id.equals(optionId)) {
                        item.values.push(valueObject);
                    }
                })
               await product.findOneAndUpdate({
                    _id: productObject._id,
                }, { options: productObject.options });
                return this.getOptionValues(productId, optionId);
            }
        } catch (error) {
            logger.error(error.toString());
        }
    }

    async getOptionValues(productId, optionId) {
        const data = await product.findById(productId);
        let option;
        data.options.forEach(item => {
            if(item._id.equals(optionId)) option = item;
        })
        if(option && option.values.length > 0) {
            return option.values;
        }
        else return [];
    }

    async getSingleOptionValue(productId, optionId, valueId) {
        const data = await this.getOptionValues(productId, optionId);
        return data.find(optionValue => optionValue.id.toString() === valueId);
    }

    async updateOptionValue(productId, optionId, valueId, data) {
        if(
            !mongoose.Types.ObjectId.isValid(productId) ||
            !mongoose.Types.ObjectId.isValid(optionId) ||
            !mongoose.Types.ObjectId.isValid(valueId)
        ) return 'Invalid identifier';

        if(data.name !== undefined) {
            const modifiedOptionValues = await this.getModifiedOptionValues(
                productId,
                optionId,
                valueId,
                data.name
            );
            await this.overwriteAllValuesOption(productId, optionId, modifiedOptionValues);
            return this.getOptionValues(productId, optionId);
        } else return 'Please, specify value name';
    }

    async deleteOptionValue(productId, optionId, valueId) {
        if(
            !mongoose.Types.ObjectId.isValid(productId) ||
            !mongoose.Types.ObjectId.isValid(optionId) ||
            !mongoose.Types.ObjectId.isValid(valueId)
        ) return 'Invalid identifier';

        const newOptionValues = await this.getOptionValuesWithDeletedOne(productId, optionId, valueId);
        const overWriteValues = await this.overwriteAllValuesOption(productId, optionId, newOptionValues);
        return this.getOptionValues(productId, optionId);
    }

    async getModifiedOptionValues(productId, optionId, valueId, name) {
        const optionValues = await this.getOptionValues(productId, optionId);
        if(optionValues && optionValues.length > 0){
            const result = optionValues.map(item => {
                if(item._id.equals(valueId)) {
                    item.name = name;
                    return item;
                } else {
                    return item;
                }
            });
            return result;
        }
    }

    async overwriteAllValuesOption(productId, optionId, values) {
        if(!values) {
            return;
        } else {
            const object = await product.findOne({ _id: productId });
            object.options.map((item) => {
                if(item._id.equals(optionId)) {
                    item.values = values
                }
            })
            const result = await product.findOneAndUpdate({_id: productId}, {
                options: object.options
            });
            return result;
        }
    }

    async getOptionValuesWithDeletedOne(productId, optionId, deleteValueId) {
        const optionValues = await this.getOptionValues(productId, optionId);
        if(optionValues && optionValues.length > 0) {
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
            if(resultOfValidate === undefined) {
                await product.findOneAndUpdate({_id: productId}, {
                    $push: {variants: variantData}
                })
                return this.getVariants(productId);
            }   
        } catch (error) {
            logger.error(error.toString());
        }
    }

    async deleteVariant(productId, variantId) {
        if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(variantId)) {
			return 'Invalid identifier';
		}

        await product.findOneAndUpdate({_id: productId}, {$pull: {
            variants: {
                _id: variantId
            }
        }});
        return this.getVariants(productId);
    }

    async updateVariant(productId, variantId, data) {
        if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(variantId)) {
			return 'Invalid identifier';
		}

        try {
            const resultOfValidate = variant.validate(data);
            if(resultOfValidate === undefined) {
                const productObject = await product.findById(productId);
                productObject.variants.forEach(variant => {
                    if(variant._id.equals(variantId)) {
                        variant = data;
                    }
                })
                await product.findByIdAndUpdate(productId, {
                    variants: productObject.variants
                })
                return this.getVariants(productId);
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
        if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(variantId)) {
			return 'Invalid identifier';
		}
        let variant;

        const productObject = await product.findById(productId);
        if(productObject && productObject.variants && productObject.variants.length > 0) {
           variant = productObject.variants.find(item => item._id.equals(variantId));
        }
        if(variant && variant.options.length > 0) {
            return variant.options;
        } else return [];
    }

    async getModifiedVariantOptions(productId, variantId, optionId, valueId) {
        let variantOptions = await this.getVariantOptions(productId, variantId);
        if(variantOptions && variantOptions.length > 0) {
            const optionToChange = variantOptions.find(option => option._id.equals(optionId));
            
            if(optionToChange === undefined) {
                // if option not exist => add new option
                variantOptions.push({
                    option_id: new mongoose.Types.ObjectId(optionId),
                    value_id: new mongoose.Types.ObjectId(valueId)
                });
            } else {
                // if option exist => set new valueId

                if(optionToChange.value_id.equals(valueId)) {
                    // don't save same value
                    return variantOptions;
                }

                variantOptions = variantOptions.map(item => {
                    if(item.option_id.equals(optionId)) {
                        item.value_id = new mongoose.Types.ObjectId(valueId);
                        return item;
                    } else {
                        return item;
                    }
                });
            }
        } else {
            variantOptions = [];
            variantOptions.push({
                option_id: new mongoose.Types.ObjectId(optionId),
                value_id: new mongoose.Types.ObjectId(valueId)
            });
        }

        return variantOptions;
    }

    async setVariantOptions(productId, variantId, data) {
        if (
            !mongoose.Types.ObjectId.isValid(productId) || 
            !mongoose.Types.ObjectId.isValid(variantId) ||
            !mongoose.Types.ObjectId.isValid(data.option_id) ||
            !mongoose.Types.ObjectId.isValid(data.value_id)) {
			return 'Invalid identifier';
		}

        const modifiedVariantOptions = await this.getModifiedVariantOptions( 
            productId, 
            variantId,
            data.option_id,
            data.value_id);
        const productObject = product.findById(productId);
        productObject.variants.forEach(item => {
            if(item._id.equals(variantId)) {
                item.options = modifiedVariantOptions;
            }
        })
        return this.getVariants(productId);
    }
    // end productVariants

    // start product shops

    async addShop(productId, data) {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
			return 'Invalid identifier';
		}
        const shopObject = {
            _id: new mongoose.Types.ObjectId(),
            shop_id: data.shop_id,
            name: data.name,
            quantity: data.quantity
        }
        await product.findByIdAndUpdate(productId, {$push: {shops: shopObject}});
        const updateProduct = await product.findById(productId);  
        return updateProduct.shops;
    }

    async deleteShop(productId, shopId) {
        if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(shopId)) {
			return 'Invalid identifier';
		} 
        const productObject = await product.findById(productId);
        productObject.shops.map((item, index) => {
            if(item._id.equals(shopId)) {
                productObject.shops.splice(index, 1);
            }
        })
        try {
            await product.findByIdAndUpdate(productId, {$set: {shops: productObject.shops}});
            const updateProduct = await product.findById(productId);  
            return updateProduct.shops;
        } catch (error) {
            return {status: false, message: `${error}`};
        }
    }

    async updateShop(productId, shopId, data) {
        if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(shopId)) {
			return 'Invalid identifier';
		} 
        const productObject = await product.findById(productId);
        const newArray = productObject.shops.map((item, index) => {
            if(item._id.equals(shopId)) {
                item.name = data.name;
                item.quantity = data.quantity;
                return item;
            } else return item;
        })
        try {
            await product.findByIdAndUpdate(productId, {$set: {shops: newArray}})   
            const updateProduct = await product.findById(productId);  
            return updateProduct.shops;
        } catch (error) {
            return {status: false, message: `${error}`};
        }
    }

    // end product shops

    // start productImage
    async getErrorMessage(err) {
        return {error: true, messsage: err.toString() };
    }

    async getImages(productId) {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
			return 'Invalid identifier';
		}

        try {
            const currentSettings = await SettingsApi.getSettings();
            const currentProduct = await product.findById(productId);
            if(currentProduct && currentProduct.images && currentProduct.images.length > 0) {
                let images = currentProduct.images.map(image => {
                    image.url = url.resolve(
                        currentSettings.domain,
                        config.productsUploadUrl + 
                        '/' +
                        currentProduct._id + 
                        '/' +
                        image.filename
                    );
                    return image;
                })
                images = images.sort((a, b) => a.position - b.position);
                return images;
            }  else return []; 
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
            if(images && images.length > 0) {
                const imageData = images.find(i => i._id.equals(imageId));
                if(imageData) {
                    const filename = imageData.filename;
                    const filePath = path.resolve(
                        config.productsUploadPath + '/' + productId + '/' + filename
                    );
                     await fse.remove(filePath);
                     const productObject = await product.findById(productId);
                     productObject.images.map((item, index) => {
                         if(item._id.equals(imageId)) {
                            productObject.images.splice(index, 1);
                         }
                     })
                     await product.findByIdAndUpdate(productId, {$set: { images: productObject.images } });
                     return true;
                } else return true
            } else return true;
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
        const uploadDir = path.resolve(
            config.productsUploadPath + '/' + productId
        );
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
            filename: requestFile.name
        };
        await product.findByIdAndUpdate(productId, {
            $push: { images: imageData }
        })
        return {status: 'success'}
    }

    async updateImage(productId, imageId, data) {
        if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(imageId)) {
			return 'Invalid identifier';
		} 
        const productObject = await product.findById(productId);
        productObject.images.map(item => {
            if(item._id.equals(imageId)) {
                item.alt = data.alt
            }
        })
        try {
            const updateData = await product.findByIdAndUpdate(productId, {
                $set: {images: productObject.images}
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
            if(currentProduct && currentProduct.files && currentProduct.files.length > 0) {
                let files = currentProduct.files.map(file => {
                    file.url = url.resolve(
                        currentSettings.domain,
                        config.productsFilesUploadUrl + 
                        '/' +
                        currentProduct._id + 
                        '/' +
                        file.filename
                    );
                    return file;
                })
                files = files.sort((a, b) => a.position - b.position);
                return files;
            }  else return []; 
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
            if(files && files.length > 0) {
                const fileData = files.find(i => i._id.equals(fileId));
                if(fileData) {
                    const filename = fileData.filename;
                    const filePath = path.resolve(
                        config.productsFilesUploadPath + '/' + productId + '/' + filename
                    );
                     await fse.remove(filePath);
                     const productObject = await product.findById(productId);
                     productObject.files.map((item, index) => {
                         if(item._id.equals(fileId)) {
                            productObject.files.splice(index, 1);
                         }
                     })
                     await product.findByIdAndUpdate(productId, {$set: { files: productObject.files } });
                     return true;
                } else return true
            } else return true;
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
        const uploadDir = path.resolve(
            config.productsFilesUploadPath + '/' + productId
        );
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
            filename: requestFile.name
        };
        await product.findByIdAndUpdate(productId, {
            $push: { files: fileData }
        })
        return {status: 'success'}
    }

    // end productFiles

    // start productStock
	async handleOrderCheckout(orderId) {
		const object = await this.getOrder(orderId);
		if (object && object.length > 0) {
			for (const item of object) {
				await this.decrementStockQuantity(
					item.product_id,
					item.variant_id,
					item.quantity
				);
			}
		}
	}

    async handleCancelOrder(orderId) {
		const object = await this.getOrder(orderId);
		if (object && object.length > 0) {
			for (const item of object) {
				await this.incrementStockQuantity(
					item.product_id,
					item.variant_id,
					item.quantity
				);
			}
		}
	}

    async handleAddOrderItem(orderId, itemId) {
		const item = await this.getOrderItem(orderId, itemId);
		if (item) {
			await this.decrementStockQuantity(
				item.product_id,
				item.variant_id,
				item.quantity
			);
		}
	}

    async handleDeleteOrderItem(orderId, itemId) {
		const item = await this.getOrderItem(orderId, itemId);
		if (item) {
			await this.incrementStockQuantity(
				item.product_id,
				item.variant_id,
				item.quantity
			);
		}
	}

    async incrementStockQuantity(productId, variantId, quantity) {
		await this.changeStockQuantity(productId, variantId, quantity);
	}

	async decrementStockQuantity(productId, variantId, quantity) {
		await this.changeStockQuantity(productId, variantId, quantity * -1);
	}

    async changeStockQuantity(productId, variantId, quantity) {
		const currentProduct = await this.getProductById(productId);
		if (currentProduct && this.isStockTrackingEnabled(currentProduct)) {
			// change product stock quantity
			const productQuantity = currentProduct.stock_quantity || 0;
			const newProductQuantity = productQuantity + quantity;

			await this.updateProduct(productId, {
				stock_quantity: newProductQuantity
			});


			if (this.isVariant(variantId)) {
				// change variant stock quantity
				const variantQuantity = this.getVariantQuantityFromProduct(
					currentProduct,
					variantId
				);
				const newVariantQuantity = variantQuantity + quantity;
				await this.updateVariant(productId, variantId, {
					stock_quantity: newVariantQuantity
				});
			}
		}
	}

    getVariantQuantityFromProduct(product, variantId) {
		const variants = product.variants;
		if (variants && variants.length > 0) {
			const variant = variants.find(
				v => v._id.equals(variantId)
			);
			if (variant) {
				return variant.stock_quantity || 0;
			}
		}
		return 0;
	}

    isVariant(variantId) {
		return variantId && variantId !== '';
	}

    isStockTrackingEnabled(product) {
		return product.stock_tracking === true;
	}

    async getOrder(orderId) {
		const filter = {
			_id: orderId,
			draft: false
		};

		const object = await order.find(filter);
		return object;
	}

    async getOrderItem(orderId, itemId) {
		const orders = await this.getOrder(orderId);
        const object = orders[0];
		if (object && object.items.length > 0) {
			return object.items.find(item => item._id.equals(itemId));
		} else {
			return null;
		}
	}

    // end productStock
}

const productApi = new ProductApi();

export default productApi;