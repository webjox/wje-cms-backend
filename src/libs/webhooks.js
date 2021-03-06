import crypto from 'crypto';
import webhooksApi from '../services/webhooks';

const trigger = async ({ event, payload }) => {
  const webhooks = await webhooksApi.getWebhooks();
  for (const webhook in webhooks) {
    if (webhook.events.includes(event)) {
      send({ event, payload, webhook });
    }
  }
};

const send = async ({ event, payload, webhook }) => {
  if (webhook && webhook.enabled === true && webhook.url && webhook.url.length > 0) {
    const data = JSON.stringify(payload);
    const signature = sign({ data, secret: webhook.secret });

    try {
      await fetch(webhook.url, {
        method: 'POST',
        body: data,
        redirect: 'manual',
        compress: true,
        headers: {
          'Content-Type': 'application/json',
          'X-Hook-Event': event,
          'X-Hook-Signature': signature,
        },
      });
    } catch (error) {
      console.log(`${error}`.red);
    }
  }
};

const sign = ({ data, secret }) => {
  if (secret && secret.length > 0) {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(data);
    const signature = hmac.digest('hex');
    return signature;
  }
  return '';
};

const events = {
  ORDER_CREATED: 'order.created',
  ORDER_UPDATED: 'order.updated',
  ORDER_DELETED: 'order.deleted',
  TRANSACTION_CREATED: 'transaction.created',
  TRANSACTION_UPDATED: 'transaction.updated',
  TRANSACTION_DELETED: 'transaction.deleted',
  CUSTOMER_CREATED: 'customer.created',
  CUSTOMER_UPDATED: 'customer.updated',
  CUSTOMER_DELETED: 'customer.deleted',
};

export default {
  trigger,
  events,
};
