/**
 * @api {get} /api/v1/shops Получение магазина
 * @apiName getShops
 * @apiGroup ShopsApi
 * @apiVersion 0.1.0
 * @apiSuccess {Array} groups Array of shops
 */

/**
 * @api {post} /api/v1/shops Создание магазина
 * @apiName createShop
 * @apiGroup ShopsApi
 * @apiVersion 0.1.0
 * @apiParam {String} name
 * @apiParam {Object} location {coords: {lat, lng}, full_address}
 * @apiParam {Object} work_time {from ,to}
 * @apiSuccess {Object} shop
 */

/**
 * @api {get} /api/v1/shops/:id Получение магазина по id
 * @apiName getShopById
 * @apiGroup ShopsApi
 * @apiVersion 0.1.0
 * @apiSuccess {Array} shop
 */

/**
 * @api {put} /api/v1/shops/:id Обновление магазина
 * @apiName updateShop
 * @apiGroup ShopsApi
 * @apiVersion 0.1.0
 * @apiParam {String} name
 * @apiParam {Object} location {coords: {lat, lng}, full_address}
 * @apiParam {Object} work_time {from ,to}
 * @apiSuccess {Object} shop
 */

/**
 * @api {delete} /api/v1/shops/:id Удаление магазина по id
 * @apiName deleteShop
 * @apiGroup ShopsApi
 * @apiVersion 0.1.0
 * @apiSuccess {Object} status
 */