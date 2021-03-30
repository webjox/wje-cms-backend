import models from '../models';

const checkoutFieldsModel = models.checkoutFieldsModel;

class CheckoutFieldsApi {
    constructor() {}

    async getCheckoutFields() {
        const data = await checkoutFieldsModel.find();
        data.map(field => {
            delete field._id;
            return field;
        })
    }

    async getCheckoutField(name) {
        const data = await checkoutFieldsModel.findOne({name: name});
        return this.changeProperties(data);
    }

    async updateCheckoutField(name, data) {
        try {
            return await checkoutFieldsModel.findOneAndUpdate({ name: name }, data, {upsert: true});
        } catch (error) {}
    }

    changeProperties(field) {
		if (field) {
			delete field._id;
			delete field.name;
		} else {
			return {
				status: 'required',
				label: '',
				placeholder: ''
			};
		}

		return field;
	}

}

export default new CheckoutFieldsApi();