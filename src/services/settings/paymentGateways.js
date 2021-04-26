import models from '../models';

const { PaymentGatewayModel } = models;

class PaymentGatewayApi {
  async getGateway(gatewayName) {
    const result = await PaymentGatewayModel.findOne({ name: gatewayName });
    return result;
  }

  async updateGateway(gatewayName, data) {
    if (Object.keys(data).length === 0) {
      return this.getGateway(gatewayName);
    }
    const result = await PaymentGatewayModel.findOneAndUpdate({ name: gatewayName }, data, {
      upsert: true,
    });
    return result;
  }
}

export default new PaymentGatewayApi();
