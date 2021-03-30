import models from '../models';

const paymentGatewayModel = models.paymentGatewayModel;

class PaymentGatewayApi {
    constructor() {}

    async getGateway(gatewayName) {
        return await paymentGatewayModel.findOne({name: gatewayName});
    }

    async updateGateway(gatewayName, data) {
        if (Object.keys(data).length === 0) {
			return this.getGateway(gatewayName);
		} else {
            return await paymentGatewayModel.findOneAndUpdate({name: gatewayName}, data, {upsert: true});
        }
    }
}

export default new PaymentGatewayApi();