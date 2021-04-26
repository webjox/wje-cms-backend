import models from '../models';

const { EmailSettingsModel } = models;

class EmailSettingsApi {
  constructor() {
    this.defaultSettings = {
      host: '',
      port: '',
      user: '',
      pass: 0,
      from_name: '',
      from_address: '',
    };
  }

  async getEmailSettings() {
    const result = await EmailSettingsModel.findOne();
    if (!result) {
      return this.defaultSettings;
    }
    return result;
  }

  async updateEmailSettings(data) {
    const countOfDocuments = await EmailSettingsModel.countDocuments();
    if (countOfDocuments === 0) {
      await EmailSettingsModel.create(this.defaultSettings);
    }

    await EmailSettingsModel.updateOne({}, data, { upsert: true });
    const result = await this.getEmailSettings();
    return result;
  }
}

export default new EmailSettingsApi();
