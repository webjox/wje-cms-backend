import models from '../models';

const productTagModel = models.productTagModel;

class ProductTagApi {
    async createTag(data) {
    try {
        const result = await productTagModel.create(data);
        return result;
    } catch (error) {
        return {status: 'error', message: `${error}`}
    }}

    async getTags(filter = {}) {
        return await productTagModel.find(filter);
    }

    async getTagById(id) {
        return await productTagModel.findById(id)
    }

    async updateTag(id, data) {
        try {
            await productTagModel.findByIdAndUpdate(id, data);
            return await this.getTagById(id);
        } catch (error) {
            return {status: 'error', message: `${error}`}
        }
    }

    async deleteTag(id) {
        try {
            await productTagModel.findByIdAndDelete(id);
            // remove tag from all products after deleting tag
            const products = await models.productModel.find({tags: id});
            products.map(product => {
                product.tags.map(async (tag, index) => {
                    if(tag._id.equals(id)) {
                        product.tags.splice(index, 1);
                        await models.productModel.findByIdAndUpdate(product._id, {
                            tags: product.tags
                        })
                    }
                })
            })
            return {status: 'success'};
        } catch (error) {
            return {status: 'error', message: `${error}`}
        }
    }
}

export default new ProductTagApi();