import path from 'path';
import url from 'url';
import fs from 'fs';
import fse from 'fs-extra';
import mongoose  from 'mongoose';
import formidable from 'formidable';
import settingsSchema from '../schemas/settingsSchema';
import config from '../../../config';
import utils from '../../libs/utils';
import logger from 'winston';

const settings = mongoose.model('settings', settingsSchema);

class SettingsApi { 
    constructor() {
        this.defaultSettings = {
            store_name: '',
			domain: config.storeBaseUrl,
			logo_file: 'logo.png',
			language: 'ru',
			currency_code: 'Rub',
			currency_symbol: '₽',
			currency_format: '${amount}',
			thousand_separator: ',',
			decimal_separator: '.',
			decimal_number: 2,
			timezone: 'Europe/Moscow',
			date_format: 'D MMMM, YYYY',
			time_format: 'h:mm a',
			default_shipping_country: '',
			default_shipping_state: '',
			default_shipping_city: '',
			default_product_sorting: 'stock_status,price,position',
			product_fields:
				'path,id,name,category_id,category_name,sku,images,enabled,discontinued,stock_status,stock_quantity,price,on_sale,regular_price,attributes,tags,position,video',
			products_limit: 30,
			weight_unit: 'kg',
			length_unit: 'cm',
			hide_billing_address: false,
			order_confirmation_copy_to: 'support@gametask.club'
        };
    }

    async getSettings() {
        const data = await settings.findOne({});
        if(data === null) {
            await settings.create(this.defaultSettings);
            return await this.getSettings();
        } else {
            return data;
        };
    }

    async updateSettings(data) {
        try {
            const resultValidation = await settings.validate(data);
            if(resultValidation === undefined) {
                await this.insertDefaultSettingsIfEmpty(); // if settings doesn't exist
                await settings.updateOne({}, {$set: data}, {upsert: true});
                return this.getSettings();
            }
        } catch (error) {
            logger.error(error.toString());
        }
    }

    async changeProperties(settingsFromDB) {
        const data = Object.assign(this.defaultSettings, settingsFromDB, {
            _id: undefined
        });
        if(data.domain === null || data.domain === undefined) {
            data.domain = '';
        }

        if (data.logo_file && data.logo_file.length > 0) {
            data.logo = url.resolve(data.domain,
                config.filesUploadUrl + '/' + data.logo_file)
        } else {
            data.logo = null;
        }
        return data;
    }

    async deleteLogo() {
        const data = this.getSettings();
        if(data.logo_file && data.logo_file.length > 0) {
            let filePath = path.resolve(
                config.filesUploadPath + '/' + data.logo_file
            );
            fs.unlink(filePath, err => {
                this.updateSettings({logo_file: null});
            })
        }
    }

    async uploadLogo(ctx, next) {
        const uploadDir = path.resolve(config.filesUploadPath);

        try {
            await fse.ensureDir(uploadDir);
        } catch (error) {
            logger.error(error.toString());
        }

        const form = new formidable.IncomingForm();
        let file_name = null, file_size = 0;
        form.uploadDir = uploadDir;

        form
            .on('fileBegin', (name, file) => {
                // Emitted whenever a field / value pair has been received.
                file.name = utils.getCorrectFileName(file.name);
                file.path = uploadDir + '/' + file.name;
            })
            .on('file', (field, file) => {
                // evert time a file has been uploaded successfully
                file_name = file.name;
                file_size = file.size;
            })
            .on('error', err => {
                ctx.status = 500;
                ctx.body = this.getErrorMessage(err);
            })
            .on('end', () => {
                if(file_name) {
                    this.updateSettings({logo_file: file_name});
                    ctx.body = {file: file_name, size: file_size};
                }
            });

        form.parse(ctx.request.body);
    }

	getErrorMessage(err) {
		return { error: true, message: err.toString() };
	}

    async insertDefaultSettingsIfEmpty() {
        const countOfDocuments = await settings.countDocuments();
        if(countOfDocuments === 0) {
           const data = await settings.create(this.defaultSettings);
           return data;
        } else return;
    }
}

export default new SettingsApi();