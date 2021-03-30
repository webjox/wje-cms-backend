import path from 'path';
import fs from 'fs';
import formidable from 'formidable';
import utils from '../libs/utils';
import config from '../../config';
import logger from 'winston';

const CONTENT_PATH = path.resolve(config.filesUploadPath);

const {readdir, stat} = fs.promises;

class FilesApi {
    constructor() {}

    async getFileData (fileName) {
        const filePath = CONTENT_PATH + '/' + fileName;
        try {
            const stats = await stat(filePath);
            if(stats.isFile()) {
                return {
                    file: fileName,
                    size: stats.size,
                    modified: stats.mtime
                };
            } else {
                return null;
            }
        } catch (error) {
            logger.error(error.toString());
        }
    }

	async getFilesData(files) {
        for(let i = 0; i < files.length; i++) {
            files[i] = await this.getFileData(files[i]);
        }
        files.filter(fileData => fileData !== null);
        files.sort((a, b) => a.modified - b.modified);
        return files;
	}

    async getFiles() {
        try {
            const files = await readdir(CONTENT_PATH);
            return this.getFilesData(files);
        } catch (error) {
            logger.error(error.toString());
        }
    }

    async deleteFile(fileName) {
        const filePath = CONTENT_PATH + '/' + fileName;
        try {
            const file = await fs.access(filePath);
            if(file) {
                await fs.unlink(filePath);
            }
        } catch (error) {
            logger.error(error.toString());
        }
    }

    async uploadFile(ctx, next) {
        const uploadDir = CONTENT_PATH;

        const form = new formidable.IncomingForm();
        let file_name = null, file_size = 0;
        form.uploadDir = uploadDir;

		form
			.on('fileBegin', (name, file) => {
				// Emitted whenever a field / value pair has been received.
				file.name = utils.getCorrectFileName(file.name);
				file.path = uploadDir + '/' + file.name;
			})
			.on('file', function(name, file) {
				// every time a file has been uploaded successfully,
				file_name = file.name;
				file_size = file.size;
			})
			.on('error', err => {
                ctx.status = 500;
                ctx.body = this.getErrorMessage(err);
			})
			.on('end', () => {
				//Emitted when the entire request has been received, and all contained files have finished flushing to disk.
				if (file_name) {
					ctx.body = { file: file_name, size: file_size };
				} else {
					ctx.status = 400;
					ctx.body = this.getErrorMessage('Required fields are missing');
				}
			});

		form.parse(ctx.request.body);
    }

    getErrorMessage(err) {
		return { error: true, message: err.toString() };
	}
}

export default new FilesApi();