/**
 * @api {get} /api/v1/products Получение товаров
 * @apiName getProducts
 * @apiGroup Products
 * @apiVersion 0.1.0
 * @apiSuccess {Array} products Array of objects
 */

/**
 * @api {post} /api/v1/products Создание товара
 * @apiName createProduct
 * @apiGroup Products
 * @apiVersion 0.1.0
 * @apiParam {String} name Название required
 * @apiParam {String} description Описание
 * @apiParam {String} meta_description Мета тег description
 * @apiParam {String} meta_title Мета тег title
 * @apiParam {Array} tags Массив объектов.
 * @apiParam {Array} attributes Массив объектов, аттрибуты товара, на выбор пользователя
 * @apiParam {Boolean} enabled Активный ли товар
 * @apiParam {String} slug Slug товара required
 * @apiParam {String} sku Артикул товара
 * @apiParam {Array} related_products_ids Массив похожих товаров
 * @apiParam {Number} price Цена товара
 * @apiParam {Number} stock_price Цена товара со склада
 * @apiParam {Number} quantity_inc Число инкремента товара при добавлении
 * @apiParam {Number} quantity_min Минимальное количество товара
 * @apiParam {Number} weight Вес товара
 * @apiParam {Array} shops Массив объектов, содержит название магазина и количества товара в нём
 * @apiParam {Number} position Позиция товара
 * @apiParam {ObjectId} categoryId Id категории
 * @apiParam {Array} category_ids Массив категорий, в которых состоит товар
 * @apiParam {Array} images Массив объектов
 * @apiParam {Array} files Массив объектов
 * @apiParam {String} video url видосика
 * @apiParam {Array} options Массив объектов. Опции товара, характеристики.
 * @apiParam {String} manufacturer Производитель
 * @apiParam {Number} package_quantity Количества товара в упаковке
 */

/**
 * @api {get} /api/v1/products/:id Получение товара по id
 * @apiName getProductById
 * @apiGroup Products
 * @apiVersion 0.1.0
 */

/**
 * @api {put} /api/v1/products Изменение товара
 * @apiName updateProduct
 * @apiGroup Products
 * @apiVersion 0.1.0
 * @apiParam {String} name Название required
 * @apiParam {String} description Описание
 * @apiParam {String} meta_description Мета тег description
 * @apiParam {String} meta_title Мета тег title
 * @apiParam {Array} tags Массив объектов.
 * @apiParam {Array} attributes Массив объектов, аттрибуты товара, на выбор пользователя
 * @apiParam {Boolean} enabled Активный ли товар
 * @apiParam {String} slug Slug товара required
 * @apiParam {String} sku Артикул товара
 * @apiParam {Array} related_products_ids Массив похожих товаров
 * @apiParam {Number} price Цена товара
 * @apiParam {Number} stock_price Цена товара со склада
 * @apiParam {Number} quantity_inc Число инкремента товара при добавлении
 * @apiParam {Number} quantity_min Минимальное количество товара
 * @apiParam {Number} weight Вес товара
 * @apiParam {Array} shops Массив объектов, содержит название магазина и количества товара в нём
 * @apiParam {Number} position Позиция товара
 * @apiParam {ObjectId} categoryId Id категории
 * @apiParam {Array} category_ids Массив категорий, в которых состоит товар
 * @apiParam {Array} images Массив объектов
 * @apiParam {Array} files Массив объектов
 * @apiParam {String} video url видосика
 * @apiParam {Array} options Массив объектов. Опции товара, характеристики.
 * @apiParam {String} manufacturer Производитель
 * @apiParam {Number} package_quantity Количества товара в упаковке
 */

/**
 * @api {delete} /api/v1/products/:id удаление товара по id
 * @apiName deleteProduct
 * @apiGroup Products
 * @apiVersion 0.1.0
 */

/**
 * @api {get} /api/v1/products/:id/sku Получение артикула товара
 * @apiName getSkuProduct
 * @apiGroup Products
 * @apiVersion 0.1.0
 */

/**
 * @api {get} /api/v1/products/:id/slug Получение slug товара
 * @apiName getSlugProduct
 * @apiGroup Products
 * @apiVersion 0.1.0
 */

/**
 * @api {get} /api/v1/products/:id/images Получение изображений товара
 * @apiName getProductImages
 * @apiGroup Products
 * @apiVersion 0.1.0
 */

/**
 * @api {post} /api/v1/products/:id/images Добавление изображения товара
 * @apiName addImageProduct
 * @apiGroup Products
 * @apiVersion 0.1.0
 */

/**
 * @api {put} /api/v1/products/:id/images/:imageId Изменение изображения товара
 * @apiName updateImageProduct
 * @apiGroup Products
 * @apiVersion 0.1.0
 * @apiParam {String} Alt
 */

/**
 * @api {delete} /api/v1/products/:id/images/:imageId Удаление изображения товара
 * @apiName deleteImageProduct
 * @apiGroup Products
 * @apiVersion 0.1.0
 */

/**
 * @api {get} /api/v1/products/:id/files Получение файлов товара
 * @apiName getFilesProduct
 * @apiGroup Products
 * @apiVersion 0.1.0
 */

/**
 * @api {post} /api/v1/products/:id/files Добавление файла товара
 * @apiName updateFileProduct
 * @apiGroup Products
 * @apiVersion 0.1.0
 */

/**
 * @api {delete} /api/v1/products/:id/files/:fileId Удаление файла товара
 * @apiName removeFileProduct
 * @apiGroup Products
 * @apiVersion 0.1.0
 */

/**
 * @api {post} /api/v1/products/:id/shops Добавление количества товара в магазине
 * @apiName addShopProduct
 * @apiGroup Products
 * @apiVersion 0.1.0
 * @apiParam {String} name
 * @apiParam {Number} quantity
 */

/**
 * @api {put} /api/v1/products/:id/shops/:shopId Изменение количества товара в магазине
 * @apiName updateShopProduct
 * @apiGroup Products
 * @apiVersion 0.1.0
 * @apiParam {String} name
 * @apiParam {Number} quantity
 */

/**
 * @api {delete} /api/v1/products/:id/shops/:shopId Удаление количества товара в магазине
 * @apiName removeShopProduct
 * @apiGroup Products
 * @apiVersion 0.1.0
 */

/**
 * @api {get} /api/v1/products/:id/options Получить опции товара
 * @apiName getProductOptions
 * @apiGroup Products
 * @apiVersion 0.1.0
 */

/**
 * @api {get} /api/v1/products/:id/options/:optionId Получить опцию товара по Id
 * @apiName getProductOptionsById
 * @apiGroup Products
 * @apiVersion 0.1.0
 */

/**
 * @api {post} /api/v1/products/:id/options Создать опцию товара
 * @apiName addProductOptions
 * @apiGroup Products
 * @apiVersion 0.1.0
 * @apiParams {String} name Название required
 * @apiParams {String} control Контроллер товара для инпута, например 'select'
 * @apiParams {Boolean} required Строгий ли выбор этой опции
 * @apiParams {Number} position Позиция опции
 * @apiParams {Array} value Значения опции
 */

/**
 * @api {put} /api/v1/products/:id/options Изменить опцию товара
 * @apiName updateProductOptions
 * @apiGroup Products
 * @apiVersion 0.1.0
 * @apiParams {String} name Название required
 * @apiParams {String} control Контроллер товара для инпута, например 'select'
 * @apiParams {Boolean} required Строгий ли выбор этой опции
 * @apiParams {Number} position Позиция опции
 * @apiParams {Array} value Значения опции
 */

/**
 * @api {delete} /api/v1/products/:id/options/:optionId Удалить опцию товара по Id
 * @apiName removeProductOptions
 * @apiGroup Products
 * @apiVersion 0.1.0
 */

/**
 * @api {get} /api/v1/products/:id/options/:optionId/values Получить значения опции товара
 * @apiName getProductOptionValues
 * @apiGroup Products
 * @apiVersion 0.1.0
 */

/**
 * @api {get} /api/v1/products/:id/options/:optionId/values/:valueId Получить значение опции товара по Id
 * @apiName getProductOptionValuesById
 * @apiGroup Products
 * @apiVersion 0.1.0
 */

/**
 * @api {post} /api/v1/products/:id/options/:optionId/values Создать значение опции товара
 * @apiName addProductOptionValues
 * @apiGroup Products
 * @apiVersion 0.1.0
 * @apiParams {String} name Название required
 */

/**
 * @api {put} /api/v1/products/:id/options/:optionId/values Изменить значение опции товара
 * @apiName updateProductOptionValues
 * @apiGroup Products
 * @apiVersion 0.1.0
 * @apiParams {String} name Название required
 */

/**
 * @api {delete} /api/v1/products/:id/options/:optionId/values/:valueId Удалить значение опции товара по Id
 * @apiName deleteProductOptionValues
 * @apiGroup Products
 * @apiVersion 0.1.0
 */

/**
 * @api {get} /api/v1/products/:id/variants Получить варианты товара
 * @apiName getProductVariants
 * @apiGroup Products
 * @apiVersion 0.1.0
 */

/**
 * @api {get} /api/v1/products/:id/variants/:variantId Получить вариант товара по Id
 * @apiName getProductVariantsById
 * @apiGroup Products
 * @apiVersion 0.1.0
 */

/**
 * @api {post} /api/v1/products/:id/variants Создать вариант товара
 * @apiName addProductVariants
 * @apiGroup Products
 * @apiVersion 0.1.0
 * @apiParams {String} sku Артикул
 * @apiParams {Number} price Цена товара
 * @apiParams {Number} weight Вес товара
 * @apiParams {Array} options опции товара
 */

/**
 * @api {put} /api/v1/products/:id/variants/:variantId Изменить вариант товара
 * @apiName updateProductVariants
 * @apiGroup Products
 * @apiVersion 0.1.0
 * @apiParams {String} sku Артикул
 * @apiParams {Number} price Цена товара
 * @apiParams {Number} weight Вес товара
 * @apiParams {Array} options опции товара
 */

/**
 * @api {delete} /api/v1/products/:id/variants/:variantId Удалить вариант товара по Id
 * @apiName deleteProductVariants
 * @apiGroup Products
 * @apiVersion 0.1.0
 */
