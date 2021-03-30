import parser from 'fast-xml-parser';
import he from 'he';
import fse from 'fs-extra'
import api from '../api';
import config from '../../../config';
import path from 'path';
import logger from 'winston';
import mongoose from 'mongoose';
import models from '../models';

const product = models.productModel;

async function xmlParse(xmlFile) {
    const fileContent = await fse.readFile(xmlFile.path, 'utf-8');
    let options = {
        attributeNamePrefix : "@_",
        attrNodeName: "attr", //default is 'false'
        textNodeName : "#text",
        ignoreAttributes : true,
        ignoreNameSpace : false,
        allowBooleanAttributes : false,
        parseNodeValue : true,
        parseAttributeValue : false,
        trimValues: true,
        cdataTagName: "__cdata", //default is 'false'
        cdataPositionChar: "\\c",
        parseTrueNumberOnly: false,
        arrayMode: false, //"strict"
        attrValueProcessor: (val, attrName) => he.decode(val, {isAttributeValue: true}),//default is a=>a
        tagValueProcessor : (val, tagName) => he.decode(val), //default is a=>a
        stopNodes: ["parse-me-as-string"]
    }
    if( parser.validate(fileContent) === true) {//optional (it'll return an object in case it's not valid)
    let jsonObj = parser.parse(fileContent,options);
    const productsArray = jsonObj.products.product;
    return addProductsToDb(productsArray);
    } else {
        let tObj = parser.getTraversalObj(fileContent,options);
        let jsonObj = parser.convertToJson(tObj,options);
        const productsArray = jsonObj.products.product;
        return addProductsToDb(productsArray);
    }

}

export async function addImagesToProduct(productId, imagesPath) {
    const files = await fse.readdir(imagesPath);
    console.log(files);
    addImage(productId, `${imagesPath}${files[0]}`)
}

async function addProductsToDb(data) {
    let counterSuccess = 0;
    let counterFailure = 0;
    for (let i = 0; i < data.length; i++) {
        try {
            const result = await api.products.addProduct(data[i]);
            if(result) {
                counterSuccess++;
                await addImage(result._id, data[i].image)
            }
            else counterFailure++;
        } catch (error) {
            
        }
    }
    return {success_added: counterSuccess, failure_added: counterFailure};
}


async function addImage(productId, productPath) {
    const uploadDir = path.resolve(
        config.productsUploadPath + '/' + productId
    );
    // create dir, if it doesn't exist
    try {
        await fse.ensureDir(uploadDir);   
    } catch (error) {
        logger.error(error.toString());
    }
    // move file with new name to product dir
    const fileName = productPath.split('/');
    try {
       await fse.rename(`catalog/${productPath}`, `${uploadDir}/${fileName[1]}`);
    } catch (error) {
        logger.error(error.toString());
    }
    // 
    const imageData = {
        _id: new mongoose.Types.ObjectId(),
        alt: '',
        position: 99,
        filename: fileName[1]
    };
    await product.findByIdAndUpdate(productId, {
        $push: { images: imageData }
    })
}

export default xmlParse;