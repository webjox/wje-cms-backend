import models from '../models';

const emailTemplateModel = models.EmailTemplatesModel;

class EmailTemplatesApi {
  async getEmailTemplate(name) {
    const result = await emailTemplateModel.findOne({ name });
    return result;
  }

  async addEmailTemplate(data) {
    const result = await emailTemplateModel.create(data);
    return result;
  }

  async updateEmailTemplate(name, data) {
    await emailTemplateModel.updateOne({ name }, data, { upsert: true });
    const result = await this.getEmailTemplate(name);
    return result;
  }
}

export default new EmailTemplatesApi();
