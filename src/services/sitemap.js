/* eslint-disable prefer-destructuring */
import logger from 'winston';
import parse from '../libs/parse';
import models from './models';

const { categoryModel } = models;
const { productModel } = models;

class SitemapApi {
  async getPaths(onlyEnabled) {
    const slug = null;
    onlyEnabled = parse.getBooleanIfValid(onlyEnabled, false);
    try {
      const paths = [];
      const reserved = await this.getSlugFromReserved();
      const productCategories = await this.getSlugArrayFromProductCategories(slug, onlyEnabled);
      const products = await this.getSlugArrayFromProducts(slug, onlyEnabled);
      if (reserved) paths.push(...reserved);
      if (productCategories) paths.push(...productCategories);
      if (products) paths.push(...products);
      return paths;
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async getSinglePath(path, onlyEnabled = false) {
    const slug = path.substr(1);
    if (slug.includes('/')) {
      const paths = await this.getPathsWithSlash(slug, onlyEnabled);
      return paths.find(element => element.path === path);
    }
    const paths = await this.getPathsWithoutSlashes(slug, onlyEnabled);
    return paths.find(element => element.path === path);
  }

  async getPathsWithoutSlashes(slug, onlyEnabled) {
    const reserved = await this.getSlugFromReserved();
    const productCategories = await this.getSlugArrayFromProductCategories(slug, onlyEnabled);
    const pages = this.getSlugArrayFromPages(slug, onlyEnabled);
    const paths = [...reserved, ...productCategories, ...pages];
    return paths;
  }

  async getPathsWithSlash(slug, onlyEnabled) {
    const products = await this.getSlugArrayFromProducts(slug, onlyEnabled);
    const pages = await this.getSlugArrayFromPages(slug, onlyEnabled);
    const paths = [...products, ...pages];
    return paths;
  }

  getSlugFromReserved() {
    const paths = [];

    paths.push({ path: '/api', type: 'reserved' });
    paths.push({ path: '/ajax', type: 'reserved' });
    paths.push({ path: '/assets', type: 'reserved' });
    paths.push({ path: '/images', type: 'reserved' });
    paths.push({ path: '/admin', type: 'reserved' });
    paths.push({ path: '/signin', type: 'reserved' });
    paths.push({ path: '/signout', type: 'reserved' });
    paths.push({ path: '/signup', type: 'reserved' });
    paths.push({ path: '/post', type: 'reserved' });
    paths.push({ path: '/posts', type: 'reserved' });
    paths.push({ path: '/public', type: 'reserved' });
    paths.push({ path: '/rss', type: 'reserved' });
    paths.push({ path: '/feed', type: 'reserved' });
    paths.push({ path: '/setup', type: 'reserved' });
    paths.push({ path: '/tag', type: 'reserved' });
    paths.push({ path: '/tags', type: 'reserved' });
    paths.push({ path: '/user', type: 'reserved' });
    paths.push({ path: '/users', type: 'reserved' });
    paths.push({ path: '/sitemap.xml', type: 'reserved' });
    paths.push({ path: '/robots.txt', type: 'reserved' });
    paths.push({ path: '/settings', type: 'reserved' });
    paths.push({ path: '/find', type: 'reserved' });
    paths.push({ path: '/account', type: 'reserved' });

    paths.push({ path: '/search', type: 'search' });

    return paths;
  }

  async getSlugArrayFromProductCategories(slug, onlyEnabled) {
    const filter = this.getFilterWithoutSlashes(slug);
    if (onlyEnabled === true) filter.enabled = true;
    const data = await categoryModel.find(filter, { slug: 1 });
    return data.map(item => ({
      path: `/${item.slug}`,
      type: 'category',
      resource: item._id,
    }));
  }

  async getSlugArrayFromProducts(slug, onlyEnabled) {
    const categoriesFilter = {};
    const productFilter = {};

    if (slug) {
      const slugParts = slug.split('/');
      categoriesFilter.slug = slugParts[0];
      productFilter.slug = slugParts[1];
    }

    if (onlyEnabled === true) {
      productFilter.enabled = true;
    }

    try {
      const productCategories = await categoryModel.find(categoriesFilter, { slug: 1 });
      const products = await productModel.find(productFilter, { slug: 1, category_id: 1 });
      products.map(product => {
        const category = productCategories.find(item => item._id.equals(product.category_id || ''));
        const categorySlug = category ? category.slug : '-';
        return {
          path: `/${categorySlug}/${product.slug}`,
          type: 'product',
          resource: product._id,
        };
      });
    } catch (error) {
      logger.error(error.toString());
    }
  }

  getSlugArrayFromPages(slug, onlyEnabled) {
    const filter = this.getFilterWithoutSlashes(slug);
    if (onlyEnabled === true) {
      filter.enabled = true;
    }
    return null;
  }

  getFilterWithoutSlashes(slug) {
    if (slug) return { slug };
    return {};
  }
}

export default new SitemapApi();
