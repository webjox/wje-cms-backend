/**
 * @api {get} /ajax/products Получение товаров
 * @apiName getProducts
 * @apiGroup Client Routes Products
 * @apiVersion 0.1.0
 * @apiSuccess {Array} Array of objects
 */

/**
 * @api {get} /ajax/products/:id Получение товара по id
 * @apiName getProductsById
 * @apiGroup Client Routes Products
 * @apiVersion 0.1.0
 * @apiSuccess {Object} product
 */

/**
 * @api {get} /ajax/products/tags Получение тэгов продуктов
 * @apiName getProductsTags
 * @apiGroup Client Routes Products
 * @apiVersion 0.1.0
 * @apiSuccess {Array} Array of categories
 */

/**
 * @api {get} /ajax/products/tags/:id Получение тэгов продуктов по id
 * @apiName getProductsTag
 * @apiGroup Client Routes Products
 * @apiVersion 0.1.0
 * @apiSuccess {Object} category
 */

/**
 * @api {get} /ajax/categories Получение категорий
 * @apiName getCategories
 * @apiGroup Client Routes Products
 * @apiVersion 0.1.0
 * @apiSuccess {Array} Array of categories
 */

/**
 * @api {get} /ajax/categories/:id Получение категории по id
 * @apiName getCategories
 * @apiGroup Client Routes Products
 * @apiVersion 0.1.0
 * @apiSuccess {Object} category
 */

/**
 * @api {get} /ajax/cart Получение корзины клиента
 * @apiName getCart
 * @apiGroup Client Routes Cart
 * @apiVersion 0.1.0
 * @apiHeader {Cookies} order_id
 */

/**
 * @api {post} /ajax/reset-password Сброс пароля
 * @apiName resetPassword
 * @apiGroup Client Routes Auth
 * @apiVersion 0.1.0
 * @apiParam {String} password
 * @apiParam {String} token
 */

/**
 * @api {post} /ajax/forgot-password Забыли пароль?
 * @apiName forgotPassword
 * @apiGroup Client Routes Auth
 * @apiVersion 0.1.0
 * @apiParam {String} email
 */

/**
 * @api {post} /ajax/login Авторизация
 * @apiName login
 * @apiGroup Client Routes Auth
 * @apiVersion 0.1.0
 * @apiParam {String} password
 * @apiParam {String} email
 * @apiSuccess {Object} response {token: string, authenticated: boolean, customer_settings: object, order_statuses: array}
 */

/**
 * @api {post} /ajax/register Регистрация
 * @apiName register
 * @apiGroup Client Routes Auth
 * @apiVersion 0.1.0
 * @apiParam {String} password
 * @apiParam {String} email
 * @apiParam {String} token
 * @apiSuccess {Object} response {status: boolean, isRightToken: boolean, isCustomerSaved: boolean}
 */

/**
 * @api {post} /ajax/customer-account Получить данные юзера
 * @apiName getUserData
 * @apiGroup Client Routes Customer
 * @apiVersion 0.1.0
 * @apiParam {String} token
 * @apiSuccess {Object} customer
 */

/**
 * @api {put} /ajax/customer-account Обновить данные юзера
 * @apiName updateUserData
 * @apiGroup Client Routes Customer
 * @apiVersion 0.1.0
 * @apiParam {String} token
 * @apiParam {String} first_name
 * @apiParam {String} last_name
 * @apiParam {String} email
 * @apiParam {String} password
 * @apiParam {Object} shipping_address {address, city, state, country, postal_code}
 * @apiParam {Array} loved_items [productId]
 */

/**
 * @api {post} /ajax/cart/items Добавить товар в корзину
 * @apiName addItemToCart
 * @apiGroup Client Routes Cart
 * @apiVersion 0.1.0
 * @apiHeader {Cookies} order_id
 * @apiParam {Object} item {product_image, product_id, variant_id, quantity, custom_price, custom_note, sku, name, variant_name, price, tax_class, weight, discount_total, price_total}
 * @apiSuccess {Object} cartData
 */

/**
 * @api {delete} /ajax/cart/items/:item_id Убрать товар из корзины
 * @apiName removeItemFromCart
 * @apiGroup Client Routes Cart
 * @apiVersion 0.1.0
 * @apiHeader {Cookies} order_id
 * @apiSuccess {Object} cartData
 */

/**
 * @api {put} /ajax/cart/items/:item_id Изменить товар в корзине
 * @apiName changeItemInCart
 * @apiGroup Client Routes Cart
 * @apiVersion 0.1.0
 * @apiHeader {Cookies} order_id 
 * @apiParam {Object} item {product_image, product_id, variant_id, quantity, custom_price, custom_note, sku, name, variant_name, price, tax_class, weight, discount_total, price_total}
 * @apiSuccess {Object} cartData
 */

/**
 * @api {put} /ajax/cart/checkout Оформление заказа
 * @apiName checkoutOrder
 * @apiGroup Client Routes Cart
 * @apiVersion 0.1.0
 * @apiHeader {Cookies} order_id 
 * @apiSuccess {Object} cartData
 */

/**
 * @api {put} /ajax/cart Обновление корзины
 * @apiName updateOrder
 * @apiGroup Client Routes Cart
 * @apiVersion 0.1.0
 * @apiHeader {Cookies} order_id 
 * @apiParam {Object} shipping_address {address, city, state, country, postal_code}
 * @apiParam {String} shipping_status
 * @apiParam {Array} items
 * @apiParam {Array} transactions
 * @apiParam {Array} discounts
 * @apiParam {Object} shipping_address
 * @apiParam {Number} tax_rate
 * @apiParam {Number} shipping_tax
 * @apiParam {Number} shipping_discount
 * @apiParam {Number} shipping_price
 * @apiParam {Number} item_tax_included
 * @apiParam {Number} shipping_tax_included
 * @apiParam {Boolean} closed
 * @apiParam {Boolean} cancelled
 * @apiParam {Boolean} delivered
 * @apiParam {Boolean} paid
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
 * @apiSuccess {Object} cartData
 */

/**
 * @api {put} /ajax/cart/charge Оплата заказа (Вроде не доработано толком)
 * @apiName chargeOrder
 * @apiGroup Client Routes Cart
 * @apiVersion 0.1.0
 * @apiHeader {Cookies} order_id 
 * @apiSuccess {Object} chargeResponse
 */

/**
 * @api {post} /ajax/pages Получение страниц
 * @apiName getPages
 * @apiGroup Client Routes pages
 * @apiVersion 0.1.0
 * @apiParam {Object} filter
 * @apiSuccess {Array} pages
 */

/**
 * @api {post} /ajax/pages/:id Получение страницы по id
 * @apiName getPageById
 * @apiGroup Client Routes pages
 * @apiVersion 0.1.0
 * @apiSuccess {Object} page
 */

/**
 * @api {get} /ajax/sitemap Получение карты сайта
 * @apiName getSitemap
 * @apiGroup Client Routes pages
 * @apiVersion 0.1.0
 * @apiSuccess {Object} sitemap
 */

/**
 * @api {get} /ajax/payment_methods Получение способов оплаты
 * @apiName getPaymentMethods
 * @apiGroup Client Routes payment
 * @apiVersion 0.1.0
 * @apiHeader {Cookies} order_id
 * @apiSuccess {Array} methods 
 */

/**
 * @api {get} /ajax/shipping_methods Получение способов доставки
 * @apiName getShippingMethods
 * @apiGroup Client Routes shipping
 * @apiVersion 0.1.0
 * @apiHeader {Cookies} order_id
 * @apiSuccess {Array} methods 
 */

/**
 * @api {get} /ajax/payment_form_settings
 * @apiName getPaymentFormSettings
 * @apiGroup Client Routes payment
 * @apiVersion 0.1.0
 * @apiHeader {Cookies} order_id
 */