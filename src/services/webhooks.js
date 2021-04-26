import LruCache from 'lru-cache';
import { Types } from 'mongoose';
import models from './models';

const { webhookModel } = models;

const cache = new LruCache({
  max: 10000,
  maxAge: 1000 * 60 * 60 * 24, /// 24h
});

const WEBHOOKS_CACHE_KEY = 'webhooks';

class WebhooksApi {
  async getWebhooks() {
    const webhooksFromCache = cache.get(WEBHOOKS_CACHE_KEY);

    if (webhooksFromCache) {
      return webhooksFromCache;
    }
    const items = await webhookModel.find();
    cache.set(WEBHOOKS_CACHE_KEY, items);
    return items;
  }

  async getSingleWebhooks(id) {
    if (!Types.ObjectId.isValid(id)) return 'invalid identifier';
    const item = await webhookModel.findById(id);
    return item;
  }

  async addWebhook(data) {
    const result = await webhookModel.insertMany([data]);
    cache.del(WEBHOOKS_CACHE_KEY);
    const newWebhookId = result.ops[0]._id;
    const newWebHook = await this.getSingleWebhooks(newWebhookId);
    return newWebHook;
  }

  async updateWebhook(id, data) {
    if (!Types.ObjectId.isValid(id)) return 'invalid identifier';

    const result = await webhookModel.findByIdAndUpdate(id, data);
    cache.del(WEBHOOKS_CACHE_KEY);
    return result;
  }

  async deleteWebhook(id) {
    if (!Types.ObjectId.isValid(id)) return 'invalid identifier';

    const result = await webhookModel.findByIdAndDelete(id);
    cache.del(WEBHOOKS_CACHE_KEY);
    return result.deletedCount > 0;
  }
}

export default new WebhooksApi();
