/**
 * @api {get} /api/v1/customer_groups Получение груп пользователей
 * @apiName getCustomersGroup
 * @apiGroup CustomersGroupsApi
 * @apiVersion 0.1.0
 * @apiSuccess {Array} groups Array of customersGroups
 */

/**
 * @api {post} /api/v1/customer_groups Создание группы пользователей
 * @apiName createCustomerGroup
 * @apiGroup CustomersGroupsApi
 * @apiVersion 0.1.0
 * @apiParam {String} name
 * @apiParam {String} description
 * @apiSuccess {Object} group
 */

/**
 * @api {get} /api/v1/customer_groups/:id Получение группы пользователей по id
 * @apiName getCustomerGroupById
 * @apiGroup CustomersGroupsApi
 * @apiVersion 0.1.0
 * @apiSuccess {Array} group
 */

/**
 * @api {put} /api/v1/customer_groups/:id Обновление гурппы пользователей
 * @apiName updateCustomerGroup
 * @apiGroup CustomersGroupsApi
 * @apiVersion 0.1.0
 * @apiParam {String} name
 * @apiParam {String} description
 * @apiSuccess {Object} groups
 */

/**
 * @api {delete} /api/v1/customer_groups/:id Удаение группы пользователей по id
 * @apiName deleteCustomerGroupById
 * @apiGroup CustomersGroupsApi
 * @apiVersion 0.1.0
 * @apiSuccess {Object} status
 */