import path from 'path';
import fs from 'fs';
import logger from 'winston';
import config from '../../config';

const CONTENT_PATH = path.resolve(config.filesUploadPath);

const { readdir, stat } = fs.promises;

class FilesApi {
  async getFileData(fileName) {
    const filePath = `${CONTENT_PATH}/${fileName}`;
    try {
      const stats = await stat(filePath);
      if (stats.isFile()) {
        return {
          file: fileName,
          size: stats.size,
          modified: stats.mtime,
        };
      }
      return null;
    } catch (error) {
      logger.error(error.toString());
    }
  }

  async getFilesData(files) {
    for (let i = 0; i < files.length; i += 1) {
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
    const filePath = `${CONTENT_PATH}/${fileName}`;
    try {
      const file = await fs.access(filePath);
      if (file) {
        await fs.unlink(filePath);
      }
    } catch (error) {
      logger.error(error.toString());
    }
  }

  getErrorMessage(err) {
    return { error: true, message: err.toString() };
  }
}

export default new FilesApi();
