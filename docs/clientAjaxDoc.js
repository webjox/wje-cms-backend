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
 * @api {get} /ajax/products/:id/images Получение изображений товара по id
 * @apiName getProductImages
 * @apiGroup Client Routes Products
 * @apiVersion 0.1.0
 * @apiSuccess {Array} Images
 */

/**
 * @api {get} /ajax/products/:id/files Получение файлов товара по id
 * @apiName getProductFiles
 * @apiGroup Client Routes Products
 * @apiVersion 0.1.0
 * @apiSuccess {Array} Files
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
 * @api {get} /ajax/products/effects Получение эффектов продуктов
 * @apiName getProductEffects
 * @apiGroup Client Routes Products
 * @apiVersion 0.1.0
 * @apiSuccess {Array} effects
 */

/**
 * @api {get} /ajax/products/manufacturers Получение эффектов продуктов
 * @apiName getProductManufacturers
 * @apiGroup Client Routes Products
 * @apiVersion 0.1.0
 * @apiSuccess {Array} manufacturers
 */

/**
 * @api {get} /ajax/payment_methods Получение методов оплаты
 * @apiName getPaymentMethods
 * @apiGroup Client Routes Products
 * @apiVersion 0.1.0
 * @apiSuccess {Array} payment_methods
 */

/**
 * @api {get} /ajax/shipping_methods Получение методов доставки
 * @apiName getShippingMethods
 * @apiGroup Client Routes Products
 * @apiVersion 0.1.0
 * @apiSuccess {Array} shipping_methods
 */

/**
 * @api {get} /ajax/shops Получение магазинов
 * @apiName getProductShops
 * @apiGroup Client Routes Products
 * @apiVersion 0.1.0
 * @apiSuccess {Array} shops
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
 * @api {get} /ajax/categories/:id/image Получение изображения категории по id
 * @apiName getCategoryImage
 * @apiGroup Client Routes Products
 * @apiVersion 0.1.0
 * @apiSuccess {Object} Image
 */

/**
 * @api {get} /ajax/cart Получение инфы о заказе клиента
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
 * @apiParam {String} [first_name]
 * @apiParam {String} [last_name]
 * @apiParam {String} [third_name]
 * @apiParam {String} [full_name]
 * @apiParam {String} [email]
 * @apiParam {String} [password]
 * @apiParam {Object} [shipping_address] {address, city, state, country, postal_code}
 * @apiParam {Array} [featured_products] productId
 * @apiParam {Object} [birthdate] (date)
 * @apiParam {Boolean} [entity]
 * @apiParam {Boolean} [wholesaler]
 * @apiParam {String} [mobile]
 * @apiParam {String} [gender]
 * @apiParam {Array} [social_accounts]
 * @apiParam {Number} [discount]
 * @apiParam {Object} [wholesaler_settings] organizationName, itn, bic, correspondingAccount, psrn, bankName, currentAccount, legalAddress, actualAddress
 * @apiSuccess {Object} userData
 */

/**
 * @api {post} /ajax/cart/items Получить товары из заказа
 * @apiName getItemsToCart
 * @apiGroup Client Routes Cart
 * @apiVersion 0.1.0
 * @apiHeader {Cookies} order_id
 * @apiSuccessExample {json} cartItems:
 *     HTTP/1.1 200 OK
 *     {
 *          [{"product_image": ["60756674fee13463a4496420", "60722674fee13e63a249s420"],
 *          "product_id": "22366524fsd132363a521650",
 *          "variant_id": "113665242ds152361a621235",
 *          "quantity": "10",
 *          "custom_price": null,
 *          "custom_note": "example note",
 *          "sku": "AS-22",
 *          "name": "Some product",
 *          "variant_name": "Black product",
 *          "price": "200",
 *          "stock_price": "100",
 *          "tax_class": null,
 *          "weight": 0,
 *          "discount_total": "10",
 *          "price_total": "1800",
 *          "stock_price_total": "900"}]
 *      }
 */

/**
 * @api {post} /ajax/cart/items Добавить товар в корзину
 * @apiName addItemToCart
 * @apiGroup Client Routes Cart
 * @apiVersion 0.1.0
 * @apiHeader {Cookies} order_id
 * @apiParam {Object} item {product_image, product_id, variant_id, quantity, custom_price, custom_note, sku, name, variant_name, price, tax_class, weight, discount_total, price_total}
 * @apiSuccessExample {json} cartItems:
 *     HTTP/1.1 200 OK
 *     {
 *          [{"product_image": ["60756674fee13463a4496420", "60722674fee13e63a249s420"],
 *          "product_id": "22366524fsd132363a521650",
 *          "variant_id": "113665242ds152361a621235",
 *          "quantity": "10",
 *          "custom_price": null,
 *          "custom_note": "example note",
 *          "sku": "AS-22",
 *          "name": "Some product",
 *          "variant_name": "Black product",
 *          "price": "200",
 *          "stock_price": "100",
 *          "tax_class": null,
 *          "weight": 0,
 *          "discount_total": "10",
 *          "price_total": "1800",
 *          "stock_price_total": "900"}]
 *      }
 */

/**
 * @api {delete} /ajax/cart/items/:item_id Убрать товар из корзины
 * @apiName removeItemFromCart
 * @apiGroup Client Routes Cart
 * @apiVersion 0.1.0
 * @apiHeader {Cookies} order_id
 * @apiSuccessExample {json} cartItems:
 *     HTTP/1.1 200 OK
 *     {
 *          []
 *      }
 */

/**
 * @api {put} /ajax/cart/items/:item_id Изменить товар в корзине
 * @apiName changeItemInCart
 * @apiGroup Client Routes Cart
 * @apiVersion 0.1.0
 * @apiHeader {Cookies} order_id
 * @apiParam {Object} item {product_image, product_id, variant_id, quantity, custom_price, custom_note, sku, name, variant_name, price, tax_class, weight, discount_total, price_total}
 * @apiSuccessExample {json} cartItems:
 *     HTTP/1.1 200 OK
 *     {
 *          [{"product_image": ["60756674fee13463a4496420", "60722674fee13e63a249s420"],
 *          "product_id": "22366524fsd132363a521650",
 *          "variant_id": "113665242ds152361a621235",
 *          "quantity": "10",
 *          "custom_price": null,
 *          "custom_note": "example note",
 *          "sku": "AS-22",
 *          "name": "Some product",
 *          "variant_name": "Black product",
 *          "price": "200",
 *          "stock_price": "100",
 *          "tax_class": null,
 *          "weight": 0,
 *          "discount_total": "10",
 *          "price_total": "1800",
 *          "stock_price_total": "900"}]
 *      }
 */

/**
 * @api {put} /ajax/cart/checkout Оформление заказа
 * @apiName checkoutOrder
 * @apiGroup Client Routes Cart
 * @apiVersion 0.1.0
 * @apiHeader {Cookies} order_id
 * @apiParam {String} shop_id Id магазина с которого происходит самовывоз/доставка.
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
