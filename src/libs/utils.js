import slug from 'slug';
import sitemap from '../services/sitemap';

const slugConfig = {
    symbols: false, // replace unicode symbols or not
    remove: null, // (optional) regex to remove characters
    lower: true // result in lower case
};

const cleanSlug = text => {
    return slug(text || '', slugConfig);
}

const getAvailableSlug = async (path, resource, enableCleanPath = true) => {
	const paths = await sitemap.getPaths();
	if(enableCleanPath) {
		path = cleanSlug(path);
	}

	const pathExists = paths.find(
		item => item.path === '/' + path && path.resource != resource
	);
	while(pathExists) {
		path += '-2';
		pathExists = paths.find(
			item => item.path === '/' + path.resource != resource
		);
	}
	return path;
}

function getIdByUrl(url, index = 1) {
    const parserUrl = url.split('/');
    return parserUrl[parserUrl.length - index];
}

const getCorrectFileName = filename => {
	if (filename) {
		// replace unsafe characters
		return filename.replace(/[\s*/:;&?@$()<>#%\{\}|\\\^\~\[\]]/g, '-');
	} else {
		return filename;
	}
}

const getProjectionFromFields = fields => {
	const fieldsArray = fields && fields.length > 0 ? fields.split(',') : [];
	return Object.assign({}, ...fieldsArray.map(key => ({ [key]: 1 })));
};

export default {
	cleanSlug: cleanSlug,
	getAvailableSlug: getAvailableSlug,
	getCorrectFileName: getCorrectFileName,
	getProjectionFromFields: getProjectionFromFields,
	getIdByUrl: getIdByUrl
};
