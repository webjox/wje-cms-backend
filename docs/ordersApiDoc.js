/**
 * @api {get} /api/v1/orders Получение заказов
 * @apiName getOrders
 * @apiGroup OrdersApi
 * @apiVersion 0.1.0
 * @apiSuccess {Array} groups Array of Orders
 */

/**
 * @api {post} /api/v1/orders Создание заказа
 * @apiName createOrder
 * @apiGroup OrdersApi
 * @apiVersion 0.1.0
 * @apiParam {Object} date_placed
 * @apiParam {Object} date_closed
 * @apiParam {Object} date_paid
 * @apiParam {Object} date_cancelled
 * @apiParam {Number} number
 * @apiParam {String} shipping_status
 * @apiParam {Array} items
 * @apiParam {Array} transactions
 * @apiParam {Array} discounts
 * @apiParam {Object} shipping_address {full_name, address, city, country, postal_code, state, phone, company, tax_number, coordinates: {latitude, longtitude}, details}
 * @apiParam {Number} tax_rate
 * @apiParam {Number} shipping_tax
 * @apiParam {Number} shipping_discount
 * @apiParam {Number} shipping_price
 * @apiParam {Boolean} item_tax_included
 * @apiParam {Boolean} shipping_tax_included
 * @apiParam {Boolean} closed
 * @apiParam {Boolean} cancelled
 * @apiParam {Boolean} delivered
 * @apiParam {Boolean} paid
 * @apiParam {Boolean} hold
 * @apiParam {Boolean} draft
 * @apiParam {String} first_name
 * @apiParam {String} last_name
 * @apiParam {String} password
 * @apiParam {String} email
 * @apiParam {String} mobile
 * @apiParam {String} referrer_url
 * @apiParam {String} landing_url
 * @apiParam {String} channel
 * @apiParam {String} note
 * @apiParam {String} comments
 * @apiParam {String} coupon
 * @apiParam {String} tracking_number
 * @apiParam {String} customer_id
 * @apiParam {String} status_id
 * @apiParam {String} payment_method_id
 * @apiParam {String} shipping_method_id
 * @apiParam {Array} tags
 * @apiParam {Object} browser
 * @apiSuccess {Object} Order
 */

/**
 * @api {get} /api/v1/orders/:id Получение заказа по id
 * @apiName getOrderById
 * @apiGroup OrdersApi
 * @apiVersion 0.1.0
 * @apiSuccess {Array} Order
 */

/**
 * @api {put} /api/v1/orders/:id Обновление заказа
 * @apiName updateOrder
 * @apiGroup OrdersApi
 * @apiVersion 0.1.0
 * @apiParam {Object} date_placed
 * @apiParam {Object} date_closed
 * @apiParam {Object} date_paid
 * @apiParam {Object} date_cancelled
 * @apiParam {Number} number
 * @apiParam {String} shipping_status
 * @apiParam {Array} items
 * @apiParam {Array} transactions
 * @apiParam {Array} discounts
 * @apiParam {Object} shipping_address {full_name, address, city, country, postal_code, state, phone, company, tax_number, coordinates: {latitude, longtitude}, details}
 * @apiParam {Number} tax_rate
 * @apiParam {Number} shipping_tax
 * @apiParam {Number} shipping_discount
 * @apiParam {Number} shipping_price
 * @apiParam {Boolean} item_tax_included
 * @apiParam {Boolean} shipping_tax_included
 * @apiParam {Boolean} closed
 * @apiParam {Boolean} cancelled
 * @apiParam {Boolean} delivered
 * @apiParam {Boolean} paid
 * @apiParam {Boolean} hold
 * @apiParam {Boolean} draft
 * @apiParam {String} first_name
 * @apiParam {String} last_name
 * @apiParam {String} password
 * @apiParam {String} email
 * @apiParam {String} mobile
 * @apiParam {String} referrer_url
 * @apiParam {String} landing_url
 * @apiParam {String} channel
 * @apiParam {String} note
 * @apiParam {String} comments
 * @apiParam {String} coupon
 * @apiParam {String} tracking_number
 * @apiParam {String} customer_id
 * @apiParam {String} status_id
 * @apiParam {String} payment_method_id
 * @apiParam {String} shipping_method_id
 * @apiParam {Array} tags
 * @apiParam {Object} browser
 * @apiSuccess {Object} Order
 */

/**
 * @api {delete} /api/v1/orders/:id Удаление заказа по id
 * @apiName deleteOrder
 * @apiGroup OrdersApi
 * @apiVersion 0.1.0
 * @apiSuccess {Object} status
 */

/**
 * @api {put} /api/v1/orders/:id/recalculate Обновить стоимость товаров
 * @apiName recalculateOrder
 * @apiGroup OrdersApi
 * @apiVersion 0.1.0
 * @apiSuccess {Object} status
 */

/**
 * @api {put} /api/v1/orders/:id/checkout оформление заказа
 * @apiName checkoutOrder
 * @apiGroup OrdersApi
 * @apiVersion 0.1.0
 * @apiSuccess {Object} status
 */

/**
 * @api {put} /api/v1/orders/:id/cancel отмена заказа
 * @apiName cancelOrder
 * @apiGroup OrdersApi
 * @apiVersion 0.1.0
 * @apiSuccess {Object} status
 */

/**
 * @api {put} /api/v1/orders/:id/close закрытие заказа
 * @apiName closeOrder
 * @apiGroup OrdersApi
 * @apiVersion 0.1.0
 * @apiSuccess {Object} status
 */

/**
 * @api {put} /api/v1/orders/:id/shipping_address обновление адресса доставки
 * @apiName updateShippinhAddress
 * @apiGroup OrdersApi
 * @apiVersion 0.1.0
 * @apiParam {String} full_name
 * @apiParam {String} address
 * @apiParam {String} city
 * @apiParam {String} country
 * @apiParam {String} postal_code
 * @apiParam {String} state
 * @apiParam {String} phone
 * @apiParam {String} company
 * @apiParam {String} tax_number
 * @apiParam {Object} coordinates {latitude, longtitude}
 * @apiParam {String} details 
 * @apiSuccess {Object} status
 */


/**
 * @api {post} /api/v1/orders/:id/items Добавить товар в заказ
 * @apiName addItem
 * @apiGroup OrdersApi
 * @apiVersion 0.1.0
 * @apiParam {Array} product_image
 * @apiParam {String} product_id
 * @apiParam {String} variant_id
 * @apiParam {Number} quantity
 * @apiParam {Number} custom_price
 * @apiParam {String} custom_note
 * @apiParam {String} sku
 * @apiParam {String} name
 * @apiParam {String} variant_name
 * @apiParam {Number} price
 * @apiParam {String} tax_class
 * @apiParam {Number} weight
 * @apiParam {Number} discount_total
 * @apiParam {Number} price_total  
 * @apiSuccess {Object} status
 */

/**
 * @api {put} /api/v1/orders/:id/items/:itemId Обновить товар в заказе
 * @apiName updateItem
 * @apiGroup OrdersApi
 * @apiVersion 0.1.0
 * @apiParam {Array} product_image
 * @apiParam {String} product_id
 * @apiParam {String} variant_id
 * @apiParam {Number} quantity
 * @apiParam {Number} custom_price
 * @apiParam {String} custom_note
 * @apiParam {String} sku
 * @apiParam {String} name
 * @apiParam {String} variant_name
 * @apiParam {Number} price
 * @apiParam {String} tax_class
 * @apiParam {Number} weight
 * @apiParam {Number} discount_total
 * @apiParam {Number} price_total  
 * @apiSuccess {Object} status
 */

/**
 * @api {delete} /api/v1/orders/:id/items Удалить товар из заказа
 * @apiName deleteItem
 * @apiGroup OrdersApi
 * @apiVersion 0.1.0 
 * @apiSuccess {Object} status
 */

/**
 * @api {post} /api/v1/orders/:id/transactions Добавить транзакцию
 * @apiName addTransaction
 * @apiGroup OrdersApi
 * @apiParam {String} transaction_id
 * @apiParam {Number} amount
 * @apiParam {String} currency
 * @apiParam {String} status
 * @apiParam {String} details
 * @apiParam {Boolean} success
 * @apiVersion 0.1.0
 * @apiSuccess {Object} status
 */

/**
 * @api {put} /api/v1/orders/:id/transactions/:transactionId Обновить транзакцию
 * @apiName updateTransaction
 * @apiGroup OrdersApi
 * @apiParam {String} transaction_id
 * @apiParam {Number} amount
 * @apiParam {String} currency
 * @apiParam {String} status
 * @apiParam {String} details
 * @apiParam {Boolean} success
 * @apiVersion 0.1.0
 * @apiSuccess {Object} status
 */

/**
 * @api {delete} /api/v1/orders/:id/transactions/:transactionId Удалить транзакцию
 * @apiName deleteTransaction
 * @apiGroup OrdersApi
 * @apiVersion 0.1.0
 * @apiSuccess {Object} status
 */

/**
 * @api {post} /api/v1/orders/:id/discounts Добавить скидку
 * @apiName addDiscount
 * @apiGroup OrdersApi
 * @apiParam {String} name
 * @apiParam {Number} amount
 * @apiVersion 0.1.0
 * @apiSuccess {Object} status
 */

/**
 * @api {put} /api/v1/orders/:id/discounts/:discountId Обновить скидку
 * @apiName updateDiscount
 * @apiGroup OrdersApi
 * @apiParam {String} name
 * @apiParam {Number} amount
 * @apiVersion 0.1.0
 * @apiSuccess {Object} status
 */

/**
 * @api {delete} /api/v1/orders/:id/discounts/:discountId Удалить скидку
 * @apiName deleteDiscount
 * @apiGroup OrdersApi
 * @apiVersion 0.1.0
 * @apiSuccess {Object} status
 */

/**
 * @api {post} /api/v1/orders/:id/charge Начисление заказа
 * @apiName chargeOrder
 * @apiGroup OrdersApi
 * @apiVersion 0.1.0
 * @apiSuccess {Object} status
 */