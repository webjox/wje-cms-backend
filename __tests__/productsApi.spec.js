import mongoose from 'mongoose';
import winston from 'winston';
import api from '../src/services/api';
import productEffectsData from '../config/productEffectsData.json';
import productManufacturersData from '../config/productManufacturersData.json';

const LOGS_FILE = 'logs/server-test.log';
const ERRORS_FILE = 'logs/errors-test.log';
const DEV_LOGS_FILE = 'logs/dev-logs-test.log';

winston.configure({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
      filename: DEV_LOGS_FILE,
    }),
    new winston.transports.File({
      level: 'info',
      handleExceptions: true,
      format: winston.format.json(),
      filename: LOGS_FILE,
    }),
    new winston.transports.File({
      level: 'error',
      handleExceptions: true,
      format: winston.format.json(),
      filename: ERRORS_FILE,
    }),
  ],
});

describe('Products Api', () => {
  let productId;
  let shopId;

  const defaultProductData = {
    name: 'Chair',
    description: 'Chair from hell',
    meta_description: 'Meta chair from hell',
    meta_title: 'Meta chair',
    tags: [],
    attributes: [],
    enabled: false,
    slug: 'chair-slug',
    sku: '',
    related_products_ids: [],
    price: 0,
    stock_price: 0,
    quantity_inc: 1,
    quantity_min: 1,
    weight: 0,
    stock_tracking: true,
    shops: [],
    position: 0,
    categoryId: null,
    category_ids: [],
    images: [],
    files: [],
    video: null,
    options: [],
    manufacturer: '',
    package_quantity: 1,
  };

  beforeAll(async () => {
    const url = `mongodb://127.0.0.1:27017/webjox-cms-jest-products`;
    const connection = await mongoose.createConnection(url, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    await connection.dropDatabase();
    await mongoose.connect(url, { useNewUrlParser: true, useFindAndModify: false });
  });

  test('Create new product', async () => {
    const input = {
      name: 'Chair',
      description: 'Chair from hell',
      meta_description: 'Meta chair from hell',
      meta_title: 'Meta chair',
      slug: 'chair-slug',
    };
    const result = await api.products.addProduct(input);
    productId = result._id;
    expect(result.name).toEqual(input.name);
  });

  test('add shop', async () => {
    const shop = await api.shops.addShop({
      name: 'Default name',
    });
    const result = await api.products.addShop(productId, {
      name: shop.name,
      shop_id: shop._id,
      quantity: 200,
    });
    shopId = result[0]._id;
    expect(result[0].name).toEqual('Default name');
  });

  test('get product', async () => {
    const result = await api.products.getProductById(productId);
    expect(result.name).toEqual(defaultProductData.name);
  });

  test('update product', async () => {
    const input = {
      name: 'Alfa chair',
      effects: ['хризантема', 'Иисус'],
    };
    await api.products.updateProduct(productId, { name: input.name, effects: input.effects });
    const result = await api.products.getProductById(productId);
    expect(result.name).toMatch(/Alfa chair/);
    expect(result.effects[0]).toEqual('хризантема');
    expect(result.effects[1]).toBeUndefined();
  });

  test('increment stock quantity', async () => {
    const quantity = 10;
    const expectQuantity = 200 + quantity;
    await api.products.incrementStockQuantity(productId, null, quantity, shopId);
    const result = await api.products.getProductById(productId);
    expect(result.shops[0].quantity).toEqual(expectQuantity);
  });

  test('decrement stock quantity', async () => {
    const quantity = 5;
    const expectQuantity = 210 - quantity;
    await api.products.decrementStockQuantity(productId, null, quantity, shopId);
    const result = await api.products.getProductById(productId);
    expect(result.shops[0].quantity).toEqual(expectQuantity);
  });

  test('get products', async () => {
    const result = await api.products.getProductList({});
    const output = await api.products.getProductById(productId);
    expect(result[0].name).toEqual(output.name);
  });

  // options tests start
  const defaultOptionData = {
    name: 'Some option',
    control: 'text',
    position: 10,
    values: [],
  };
  const deafaultOptionValueData = {
    name: 'Some value',
  };
  let optionId;
  let optionValueId;

  test('add option', async () => {
    const input = { ...defaultOptionData };

    const result = await api.products.addOption(productId, input);
    optionId = result[0]._id;
    expect(result[0].name).toEqual(input.name);
  });

  test('get options', async () => {
    const result = await api.products.getOptions(productId);
    expect(result[0]._id).toEqual(optionId);
  });

  test('get option', async () => {
    const result = await api.products.getSingleOption(productId, optionId);
    expect(result._id).toEqual(optionId);
  });

  test('update option', async () => {
    const result = await api.products.updateOption(productId, optionId, { name: 'Hell option' });
    expect(result[0].name).toEqual('Hell option');
  });

  test('add option value', async () => {
    const result = await api.products.addOptionValue(productId, optionId, deafaultOptionValueData);
    optionValueId = result[0]._id;
    expect(result[0].name).toEqual(deafaultOptionValueData.name);
  });

  test('get option values', async () => {
    const result = await api.products.getOptionValues(productId, optionId);
    expect(result[0]._id).toEqual(optionValueId);
  });

  test('get option value', async () => {
    const result = await api.products.getSingleOptionValue(productId, optionId, optionValueId);
    expect(result._id).toEqual(optionValueId);
  });

  test('update option value', async () => {
    const result = await api.products.updateOptionValue(productId, optionId, optionValueId, {
      name: 'Hell value',
    });
    expect(result.name).toEqual('Hell value');
  });

  test('remove option value', async () => {
    const result = await api.products.deleteOptionValue(productId, optionId, optionValueId);
    expect(result[0]).toBeUndefined();
  });

  test('remove option', async () => {
    const result = await api.products.deleteOption(productId, optionId);
    expect(result.options[0]).toBeUndefined();
  });
  // end options tests

  // start product variants
  const defaultVariantData = {
    sku: 'HELL-1',
    price: 150,
    stock_quantity: 99,
    weight: 1.5,
  };
  let variantId;

  test('add product variant', async () => {
    const result = await api.products.addVariant(productId, defaultVariantData);
    variantId = result[0]._id;
    expect(result[0].sku).toEqual(defaultVariantData.sku);
  });

  test('get product variants', async () => {
    const result = await api.products.getVariants(productId);
    expect(result[0].sku).toEqual(defaultVariantData.sku);
  });

  test('update product variant', async () => {
    const result = await api.products.updateVariant(productId, variantId, {
      stock_quantity: 100,
    });
    expect(result[0].stock_quantity).toEqual(100);
  });

  test('get product variant options', async () => {
    const result = await api.products.getVariantOptions(productId, variantId);
    expect(result.length).toEqual(0);
  });

  test('get modified variant options', async () => {
    const result = await api.products.getModifiedVariantOptions(
      productId,
      variantId,
      optionId,
      optionValueId,
    );
    expect(result[0].option_id).toEqual(optionId);
    expect(result[0].value_id).toEqual(optionValueId);
  });

  test('set variant options', async () => {
    const result = await api.products.setVariantOptions(productId, variantId, {
      option_id: optionId,
      value_id: optionValueId,
    });
    expect(result[0].options[0].option_id).toEqual(optionId);
    expect(result[0].options[0].value_id).toEqual(optionValueId);
  });

  test('delete variant', async () => {
    const result = await api.products.deleteVariant(productId, variantId);
    expect(result.length).toEqual(0);
  });
  // end product variants

  // start product helpersData
  test('add effect', async () => {
    const result = await api.products.updateProduct(productId, {
      effects: [productEffectsData.data[0].name],
    });
    expect(result.effects[0]).toEqual(productEffectsData.data[0].name);
  });

  test('add manufacturer', async () => {
    const result = await api.products.updateProduct(productId, {
      manufacturer: productManufacturersData.data[0],
    });
    expect(result.manufacturer).toEqual(productManufacturersData.data[0]);
  });
  // end product helpersData
});
