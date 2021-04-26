/**
 * @api {get} /api/v1/customers Получение пользователей
 * @apiName getCustomers
 * @apiGroup CustomersApi
 * @apiVersion 0.1.0
 * @apiSuccess {Array} customers Array of customers
 */

/**
 * @api {post} /api/v1/customers Создание пользователя
 * @apiName createCustomer
 * @apiGroup CustomersApi
 * @apiVersion 0.1.0
 * @apiParam {String} email
 * @apiParam {Boolean} entity
 * @apiParam {Boolean} wholesaler
 * @apiParam {String} password
 * @apiParam {Number} total_spent
 * @apiParam {Number} orders_count
 * @apiParam {Array} loved_items
 * @apiParam {String} note
 * @apiParam {String} mobile
 * @apiParam {String} full_name
 * @apiParam {String} first_name
 * @apiParam {String} last_name
 * @apiParam {String} third_name
 * @apiParam {String} gender
 * @apiParam {String} group_id
 * @apiParam {Array} tags
 * @apiParam {Array} social_accounts
 * @apiParam {Object} birthdate (date)
 * @apiParam {Object} shipping_address
 * @apiParam {Object} browser
 * @apiParam {Array} scopes
 * @apiParam {Number} year_spent
 * @apiParam {Number} discount
 * @apiParam {Object} wholesaler_settings organizationName, itn, bic, correspondingAccount, psrn, bankName, currentAccount, legalAddress, actualAddress
 * @apiSuccess {Object} customer
 */

/**
 * @api {get} /api/v1/customers/:id Получение пользователя по id
 * @apiName getCustomerById
 * @apiGroup CustomersApi
 * @apiVersion 0.1.0
 * @apiSuccess {Array} customers Array of customers
 */

/**
 * @api {put} /api/v1/customers/:id Обновление пользователя
 * @apiName updateCustomer
 * @apiGroup CustomersApi
 * @apiVersion 0.1.0
 * @apiParam {String} email
 * @apiParam {Boolean} entity
 * @apiParam {Boolean} wholesaler
 * @apiParam {String} password
 * @apiParam {Number} total_spent
 * @apiParam {Number} orders_count
 * @apiParam {Array} featured_products
 * @apiParam {String} note
 * @apiParam {String} mobile
 * @apiParam {String} full_name
 * @apiParam {String} first_name
 * @apiParam {String} last_name
 * @apiParam {String} third_name
 * @apiParam {String} gender
 * @apiParam {String} group_id
 * @apiParam {Array} tags
 * @apiParam {Array} social_accounts
 * @apiParam {Object} birthdate (date)
 * @apiParam {Object} shipping_address
 * @apiParam {Object} browser
 * @apiParam {Array} scopes
 * @apiParam {Number} year_spent
 * @apiParam {Number} discount
 * @apiParam {Object} wholesaler_settings organizationName, itn, bic, correspondingAccount, psrn, bankName, currentAccount, legalAddress, actualAddress
 * @apiSuccess {Object} customer
 */

/**
 * @api {delete} /api/v1/customers/:id Удаение пользователя по id
 * @apiName deleteCustomerById
 * @apiGroup CustomersApi
 * @apiVersion 0.1.0
 * @apiSuccess {Object} status
 */
