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
 * @api {delete} /api/v1/pages/:pageId Удаление страницы
 * @apiName deletePage
 * @apiGroup Pages-Api
 * @apiVersion 0.1.0
 */

/**
 * @api {post} /api/v1/pages/:pageId/image Добавить обложку страницы
 * @apiName uploadPageImage
 * @apiGroup Pages-Api
 * @apiVersion 0.1.0
 * @apiParam {Object} image
 * @apiSuccess {Object} page Updated Page
 */

/**
 * @api {put} /api/v1/pages/:pageId/image Обновить обложку страницы
 * @apiName updatePageImage
 * @apiGroup Pages-Api
 * @apiVersion 0.1.0
 * @apiParam {String} alt
 * @apiSuccess {Object} page Updated Page
 */

/**
 * @api {delete} /api/v1/pages/:pageId/image Удалить обложку страницы
 * @apiName deletePageImage
 * @apiGroup Pages-Api
 * @apiVersion 0.1.0
 * @apiSuccess {Object} page Updated Page
 */