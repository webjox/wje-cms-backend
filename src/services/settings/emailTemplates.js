import models from '../models';

const emailTemplateModel = models.emailTemplatesModel;

class EmailTemplatesApi {
    constructor() {}

    async getEmailTemplate(name) {
        return await emailTemplateModel.findOne({name: name});
    }

    async addEmailTemplate(data) {
        return await emailTemplateModel.create(data);
    }

    async updateEmailTemplate(name, data) {
        return await emailTemplateModel.updateOne({name: name}, data, {upsert: true})
    }
}

export default new EmailTemplatesApi()