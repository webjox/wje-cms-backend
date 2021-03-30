/**
 * @api {get} /api/v1/pages Получение всех страниц
 * @apiName getPages
 * @apiGroup getAllPages
 * @apiVersion 0.1.0
 * @apiSuccess {Array} Array of objects
 */

/**
 * @api {get} /api/v1/pages/:id Получение страницы по id
 * @apiName getPageById
 * @apiGroup Pages-Api
 * @apiVersion 0.1.0
 * @apiSuccess {Object} page
 */

/**
 * @api {post} /api/v1/pages Создание страницы
 * @apiName createPage
 * @apiGroup Pages-Api
 * @apiVersion 0.1.0
 * @apiParam {String} meta_title
 * @apiParam {String} meta_description
 * @apiParam {String} slug
 * @apiParam {Boolean} enabled
 * @apiParam {String} content html-string
 */

/**
 * @api {put} /api/v1/pages/:pageId Изменение страницы
 * @apiName updatePage
 * @apiGroup Pages-Api
 * @apiVersion 0.1.0
 * @apiParam {String} meta_title
 * @apiParam {String} meta_description
 * @apiParam {String} slug
 * @apiParam {Boolean} enabled
 * @apiParam {String} content html-string
 */

/**
 * @api {delete} /api/v1/pages/:pageId Создание страницы
 * @apiName Webjox-сms
 * @apiGroup Pages-Api
 * @apiVersion 0.1.0
 */
