import models from '../models';

const commerceSettingsModel = models.commerceSettingsModel;

class CommerceSettingsApi {
    constructor() {
        this.defaultSettings = {
            status: '',
            serviceOptions: '',
            deliveryRadius: ''
        }
    }

    async retrieveCommerceSettings() {
        const data = await commerceSettingsModel.findOne();
        return this.changeProperties(data);
    }

    async updateCommerceSettings(data) {
        await this.insertDefaultSettingsIfEmpty;
        try {
            await commerceSettingsModel.findOneAndUpdate({}, data, {upsert: true});
            return this.retrieveCommerceSettings();
        } catch (error) {}
    }

    async insertDefaultSettingsIfEmpty() {
        const countOfDocs = await commerceSettingsModel.countDocuments();
        if(countOfDocs === 0) {
            return await commerceSettingsModel.create(this.defaultSettings);
        } else {
            return;
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