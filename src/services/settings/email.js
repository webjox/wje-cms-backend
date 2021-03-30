import models from '../models';

const emailSettingsModel = models.emailSettingsModel;

class EmailSettingsApi {
    constructor() {
        this.defaultSettings = {
            host: '',
            port: '',
            user: '',
            pass: 0,
            from_name: '',
            from_address: ''
        }
    }


    async getEmailSettings() {
        return await emailSettingsModel.findOne();
    }

    async updateEmailSettings(data) {
        const countOfDocuments = await emailSettingsModel.countDocuments();
        if(countOfDocuments === 0) {
            await emailSettingsModel.create(this.defaultSettings);
        }

        return await emailSettingsModel.updateOne({}, data, {upsert: true});
    }
}

export default new EmailSettingsApi();