import LruCache from 'lru-cache';
import { Types } from 'mongoose';
import logger from 'winston';
import models from './models';

const { redirectModel } = models;

const cache = new LruCache({
  max: 10000,
  maxAge: 1000 * 60 * 60 * 24, // 24h
});

const REDIRECTS_CACHE_KEY = 'redirects';

class RedirectsApi {
  async getRedirects() {
    const redirectsFromCache = cache.get(REDIRECTS_CACHE_KEY);
    if (redirectsFromCache) {
      return redirectsFromCache;
    }
    const items = await redirectModel.find();
    cache.set(REDIRECTS_CACHE_KEY, items);
    return items;
  }

  async getSingleRedirect(id) {
    if (!Types.ObjectId.isValid(id)) {
      return `Invalid identifier`;
    }

    const result = await redirectModel.findById(id);
    return result;
  }

  async addRedirect(data) {
    try {
      const result = await redirectModel.create(data);
      if (result) {
        cache.del(REDIRECTS_CACHE_KEY);
        return result;
      }
    } catch (error) {
      return error;
    }
  }

  async updateRedirect(id, data) {
    if (!Types.ObjectId.isValid(id)) {
      return `Invalid identifier`;
    }

    try {
      const result = await redirectModel.findByIdAndUpdate(id, data);
      if (result) {
        cache.del(REDIRECTS_CACHE_KEY);
        return result;
      }
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async deleteRedirect(id) {
    if (!Types.ObjectId.isValid(id)) {
      return `Invalid identifier`;
    }

    try {
      const result = await redirectModel.findByIdAndDelete(id);
      if (result) {
        cache.del(REDIRECTS_CACHE_KEY);
        return result;
      }
    } catch (error) {
      logger.error(error.toString());
    }
  }
}

export default new RedirectsApi();
