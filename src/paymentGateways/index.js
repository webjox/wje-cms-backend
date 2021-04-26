import ordersApi from '../services/orders';
import settingsApi from '../services/settings/settings';
import paymentGatewaysApi from '../services/settings/paymentGateways';

const getOptions = async orderId => {
  const order = await ordersApi.getSingleOrder(orderId);
  const settings = await settingsApi.getSettings();

  if (order && order.payment_method_id) {
    const gatewaySettings = paymentGatewaysApi.getGateway(order.payment_method_gateway);
    const options = {
      gateway: order.payment_method_gateway,
      gatewaySettings,
      order,
      amount: order.grand_total,
      currency: settings.currency_code,
    };

    return options;
  }
};

const getPaymentFormSettings = async orderId => {
  const options = await getOptions(orderId);
  switch (options.gateway) {
    case `some`:
      break;
    default:
      return `Invalid gateway`;
  }
};

const paymentNotification = async (ctx, gateway) => {
  const gatewaySettings = await paymentGatewaysApi.getGateway(gateway);
  const options = {
    gateway,
    gatewaySettings,
    req: ctx.request,
    res: ctx.response,
  };

  switch (gateway) {
    case `some`:
      break;

    default:
      return `Invalid gateway`;
  }
};

const processOrderPayment = async order => {
  const orderAlreadyCharged = order.paid === true;
  if (orderAlreadyCharged) {
    return true;
  }

  const gateway = order.payment_method_gateway;
  const gatewaySettings = await paymentGatewaysApi.getGateway(gateway);
  const settings = await settingsApi.getSettings();

  switch (gateway) {
    case 'some':
    default:
      return 'Invalid gateway';
  }
};

export default {
  getPaymentFormSettings,
  paymentNotification,
  processOrderPayment,
};
