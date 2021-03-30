import url from 'url';
import utils from '../../libs/utils';
import parse from '../../libs/parse';
import config from '../../../config';
import models from '../models';
import settingsApi from '../settings/settings';
import { Types } from 'mongoose';
import logger from 'winston';

const pageModel = models.pageModel;

const DEFAULT_SORT = { is_system: -1, date_created: 1 };

class PageApi {
    constructor() {}

    getFilter(params ={}) {
        const filter = {};
        const tags = parse.getString(params.tags);
        if(Types.ObjectId.isValid(params._id)) {
            filter._id = params._id;
        }
        if(tags && tags.length > 0) {
            filter.tags = tags;
        }
        return filter;
    }

    getSortQuery({ sort }) {
		if (sort && sort.length > 0) {
			const fields = sort.split(',');
			return Object.assign(
				...fields.map(field => ({
					[field.startsWith('-') ? field.slice(1) : field]: field.startsWith(
						'-'
					)
						? -1
						: 1
				}))
			);
		} else {
			return DEFAULT_SORT;
		}
	}
    
    async getPages(params = {}) {
        const filter = this.getFilter(params);
        const sortQuery = this.getSortQuery(params);
        const projection = utils.getProjectionFromFields(params.fields);
        const settings = await settingsApi.getSettings();
        const domain = settings.domain;
        const items = pageModel.find(filter, projection).sort(sortQuery);
        const result = items.map(page => this.changeProperties(page, domain));
        return result;
    }

    async getSinglePage(id) {
        if(!Types.ObjectId.isValid(id)) {
            return `Invalid identifier`
        }

        return await pageModel.findById(id);
    }

    async addPage(data) {
        try {
            return await pageModel.create(data);
        } catch (error) {
            logger.error(error.toString());
        }
    }

    async updatePage(id, data) {
        if(!Types.ObjectId.isValid(id)) {
            return `Invalid identifier`
        }

        try {
            return await pageModel.findByIdAndUpdate(id, data);
        } catch (error) {
            logger.error(error.toString());
        }
    }

    async deletePage(id) {
        if(!Types.ObjectId.isValid(id)) {
            return `Invalid identifier`
        }

        try {
            return await pageModel.findByIdAndDelete(id);
        } catch (error) {
            logger.error(error.toString());
        }
    }

    changeProperties(item, domain) {
		if (item) {
			if (!item.slug) {
				item.slug = '';
			}

			item.url = url.resolve(domain, `/${item.slug}`);
			item.path = url.resolve('/', item.slug);
		}

		return item;
	}
}

export default new PageApi();