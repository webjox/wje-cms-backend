import winston from 'winston';
import url from 'url';
import config from './config';
import models from './src/services/models';
import mongoose from 'mongoose';

const DEFAULT_LANGUAGE = `russian`;

const addPage = async (pageObject) => {
    try {
        const countOfDoc = await models.pageModel.countDocuments({
            slug: pageObject.slug
        });
        const docExists = +countOfDoc > 0;
        if(!docExists) {
            await models.pageModel.create(pageObject);
            winston.info(`- Added page: /${pageObject.slug}`);
        }
    } catch (error) {
        console.log(`${error}`.red)
    }
}

const addAllPages = async () => {
    await addPage({
        slug: '',
		meta_title: 'Home',
		enabled: true,
		is_system: true
    });
    await addPage({
		slug: 'checkout',
		meta_title: 'Checkout',
		enabled: true,
		is_system: true
    });
    await addPage({
		slug: 'checkout-success',
		meta_title: 'Thank You!',
		enabled: true,
		is_system: true
    });
    await addPage({
		slug: 'about',
		meta_title: 'About us',
		enabled: true,
		is_system: false
    });
    await addPage({
		slug: 'login',
		meta_title: 'Login',
		enabled: true,
		is_system: true
    });
    await addPage({
		slug: 'register',
		meta_title: 'Register',
		enabled: true,
		is_system: true
    });
    await addPage({
		slug: 'customer-account',
		meta_title: 'Customer Account',
		enabled: true,
		is_system: true
    });
    await addPage({
		slug: 'forgot-password',
		meta_title: 'Forgot Password',
		enabled: true,
		is_system: true
    });
    await addPage({
		slug: 'reset-password',
		meta_title: 'Reset Password',
		enabled: true,
		is_system: true
    });
}

const addAllProducts = async () => {
    const productCategoriesCount = await models.categoryModel.countDocuments({});
    const productsCount = await models.productModel.countDocuments({});
    const productsNotExists = productCategoriesCount === 0 && productsCount === 0;
    if(productsNotExists) {
        try {
        const catA = await models.categoryModel.create({
            name: 'Category A',
			slug: 'category-a',
			image: '',
			parent_id: null,
			enabled: true
        });
        const catB = await models.categoryModel.create({
			name: 'Category B',
			slug: 'category-b',
			image: '',
			parent_id: null,
			enabled: true
        });
        const catC = await models.categoryModel.create({
			name: 'Category C',
			slug: 'category-c',
			image: '',
			parent_id: null,
			enabled: true
        });
        const catA1 = await models.categoryModel.create({
			name: 'Subcategory 1',
			slug: 'category-a-1',
			image: '',
			parent_id: catA._id,
			enabled: true
        });
        const catA2 = await models.categoryModel.create({
			name: 'Subcategory 2',
			slug: 'category-a-2',
			image: '',
			parent_id: catA._id,
			enabled: true
        });
        const catA3 = await models.categoryModel.create({
			name: 'Subcategory 3',
			slug: 'category-a-3',
			image: '',
			parent_id: catA._id,
			enabled: true
        });

        await models.productModel.create({
            name: 'Product A',
			slug: 'product-a',
			category_id: catA.insertedId,
			regular_price: 950,
			stock_quantity: 999,
			enabled: true,
			discontinued: false,
			attributes: [
				{ name: 'Brand', value: 'Brand A' },
				{ name: 'Size', value: 'M' }
			]
        })

        await models.productModel.create({
			name: 'Product B',
			slug: 'product-b',
			category_id: catA.insertedId,
			regular_price: 1250,
			stock_quantity: 999,
			enabled: true,
			discontinued: false,
			attributes: [
				{ name: 'Brand', value: 'Brand B' },
				{ name: 'Size', value: 'L' }
			]
        })

        winston.info('- Added products');
     } catch (error) { console.log(`${error}.red`) }
    }
}

const addOrderConfirmationEmailTemplates = async () => {
    const emailTemplatesCount = await models.emailTemplatesModel.countDocuments({name: 'order_confirmation'});
    const emailTemplatesNotExists = emailTemplatesCount === 0;
    if (emailTemplatesNotExists) {
        await models.emailTemplatesModel.create({
            name: 'order_confirmation',
			subject: 'Order confirmation',
			body: `<div>
			<div><b>Order number</b>: {{number}}</div>
			<div><b>Shipping method</b>: {{shipping_method}}</div>
			<div><b>Payment method</b>: {{payment_method}}</div>
		  
			<div style="width: 100%; margin-top: 20px;">
			  Shipping to<br /><br />
			  <b>Full name</b>: {{shipping_address.full_name}}<br />
			  <b>Address 1</b>: {{shipping_address.address1}}<br />
			  <b>Address 2</b>: {{shipping_address.address2}}<br />
			  <b>Postal code</b>: {{shipping_address.postal_code}}<br />
			  <b>City</b>: {{shipping_address.city}}<br />
			  <b>State</b>: {{shipping_address.state}}<br />
			  <b>Phone</b>: {{shipping_address.phone}}
			</div>
		  
			<table style="width: 100%; margin-top: 20px;">
			  <tr>
				<td style="width: 40%; padding: 10px 0px; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; text-align: left;">Item</td>
				<td style="width: 25%; padding: 10px 0px; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; text-align: right;">Price</td>
				<td style="width: 10%; padding: 10px 0px; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; text-align: right;">Qty</td>
				<td style="width: 25%; padding: 10px 0px; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; text-align: right;">Total</td>
			  </tr>
		  
			  {{#each items}}
			  <tr>
				<td style="padding: 10px 0px; border-bottom: 1px solid #ccc; text-align: left;">{{name}}<br />{{variant_name}}</td>
				<td style="padding: 10px 0px; border-bottom: 1px solid #ccc; text-align: right;">$ {{price}}</td>
				<td style="padding: 10px 0px; border-bottom: 1px solid #ccc; text-align: right;">{{quantity}}</td>
				<td style="padding: 10px 0px; border-bottom: 1px solid #ccc; text-align: right;">$ {{price_total}}</td>
			  </tr>
			  {{/each}}
		  
			</table>
		  
			<table style="width: 100%; margin: 20px 0;">
			  <tr>
				<td style="width: 80%; padding: 10px 0px; text-align: right;"><b>Subtotal</b></td>
				<td style="width: 20%; padding: 10px 0px; text-align: right;">$ {{subtotal}}</td>
			  </tr>
			  <tr>
				<td style="width: 80%; padding: 10px 0px; text-align: right;"><b>Shipping</b></td>
				<td style="width: 20%; padding: 10px 0px; text-align: right;">$ {{shipping_total}}</td>
			  </tr>
			  <tr>
				<td style="width: 80%; padding: 10px 0px; text-align: right;"><b>Grand total</b></td>
				<td style="width: 20%; padding: 10px 0px; text-align: right;">$ {{grand_total}}</td>
			  </tr>
			</table>
		  
		  </div>`
        });
        winston.info('- Added email template for Order Confirmation');
    }
}

const addForgotPasswordEmailTemplates_en = async () => {
    const emailTemplatesCount = await models.emailTemplatesModel.countDocuments({name: 'forgot_password_en'});
    const emailTemplatesNotExists = emailTemplatesCount === 0;
    if (emailTemplatesNotExists) {
        await models.emailTemplatesModel.create({
			name: 'forgot_password_en',
			link: 'reset password',
			subject: `Password Reset on `,
			body: `<div style="line-height: 30px">
			<div><b>You requested on {{shop_name}} a password reset.</b><div>
			<div><b>Please click on the link bellow to get back to {{shop_name}} to reset your password.</b><div>
			<div><b>Link:</b> {{forgot_password_link}}<div>

		  </div>`
        });
        winston.info('- Added email template for Password Reset English');
    }
}

const addForgotPasswordEmailTemplates_ru = async () => {
    const emailTemplatesCount = await models.emailTemplatesModel.countDocuments({name: 'forgot_password_ru'});
    const emailTemplatesNotExists = emailTemplatesCount === 0;
    if (emailTemplatesNotExists) {
        await models.emailTemplatesModel.create({
			name: 'forgot_password_ru',
			link: 'Сбросить пароль',
			subject: `Сброс пароля`,
			body: `<div style="line-height: 30px">
			<div><b>Вы запросили сброс пароля.</b><div>
			<div><b>Пожалуйста, перейдите по указанной ссылке для сброса пароля.</b><div>
			<div><b>Ссылка:</b> {{forgot_password_link}}<div>

		  </div>`
        });
        winston.info('- Added email template for Password Reset Russian');
    }
}

const addRegisterDoiEmailTemplates_en = async () => {
    const emailTemplatesCount = await models.emailTemplatesModel.countDocuments({name: 'register_doi_en'});
    const emailTemplatesNotExists = emailTemplatesCount === 0;
    if (emailTemplatesNotExists) {
        await models.emailTemplatesModel.create({
			name: 'register_doi_en',
			link: 'register now',
			subject: `Registration on `,
			body: `<div style="line-height: 30px">
			<div><b>You requested on {{shop_name}} to set up a new account.</b><div>
			<div><b>Please click on the link bellow to get finish the account setup.</b><div>
			<div><b>Link:</b><br />
			{{register_doi_link}}
			<br />
			<div><b>If you have any questions please dont hasitate and call our customerservice.</b></div>
			<br />
			<div><b>Best regards</b></div>
			<br />
			<div><b><h3>{{shop_name}}</h3></b><div>

		  </div>`
        });
		winston.info('- Added email template for Account Activation English');
    }
}

const addRegisterDoiEmailTemplates_ru = async () => {
    const emailTemplatesCount = await models.emailTemplatesModel.countDocuments({name: 'register_doi_ru'});
    const emailTemplatesNotExists = emailTemplatesCount === 0;
    if (emailTemplatesNotExists) {
        await models.emailTemplatesModel.create({
			name: 'register_doi_ru',
			link: 'Активировать аккаунт',
			subject: `Регистрация`,
			body: `<div style="line-height: 30px">
			<div><b>Вы успешно зарегистрировались в нашем магазине.</b><div>
			<div><b>Пожалуйста, перейдите по указанной ссылке для активации Вашего аккаунта.</b><div>
			<div><b>Ссылка:</b><br />
			{{register_doi_link}}
			<br />
			<div><b>Если у Вас есть какие-либо вопросы, задайте нам их в ответном письме.</b></div>

		  </div>`
        });
		winston.info('- Added email template for Account Activation Russian');
    }
}

const addShippingMethods = async () => {
    const shippingMethodsCount = await models.orderShippingModel.countDocuments({});
    const shippingMethodsNotExists = shippingMethodsCount === 0;
    if(shippingMethodsNotExists) {
        await models.orderShippingModel.create({
            name: 'Courier Service',
			enabled: true,
			conditions: {
				countries: [],
				states: [],
				cities: [],
				subtotal_min: 0,
				subtotal_max: 0,
				weight_total_min: 0,
				weight_total_max: 0
			}
        })
        winston.info('- Added shipping method');
    }
}

const addPaymentMethods = async () => {
    const paymentMethodsCount = await models.orderPaymentModel.countDocuments({});
    const paymentMethodsNotExists = paymentMethodsCount === 0;
    if(paymentMethodsNotExists) {
        await models.orderPaymentModel.create({
			name: 'Cash On Delivery',
			enabled: true,
			conditions: {
				countries: [],
				shipping_method_ids: [],
				subtotal_min: 0,
				subtotal_max: 0
			}
        })
        winston.info('- Added payment method');
    }
}

const createIndex = async (model, fields, options) => {
    await model.createIndexes(fields, options);
}

const createAllIndexes = async () => {
    const pagesIndexes = await models.pageModel.listIndexes();

    if(pagesIndexes.length === 1) {
        await createIndex(models.pageModel, {enabled: 1})
        await createIndex(models.pageModel, {slug: 1})
        winston.info('- Created indexes for: pages');
    }

    const productCategoriesIndexes = await models.categoryModel.listIndexes();

    if(productCategoriesIndexes.length === 1) {
        await createIndex(models.categoryModel, {enabled: 1})
        await createIndex(models.categoryModel, {slug: 1})
        winston.info('- Created indexes for: productCategories');
    }

    const productsIndexes = await models.productModel.listIndexes();

    if(productsIndexes.length === 1) {
        await createIndex(models.productModel, {enabled: 1})
        await createIndex(models.productModel, {slug: 1})
        await createIndex(models.productModel, {category_id: 1})
        await createIndex(models.productModel, {sku: 1})
        await createIndex(models.productModel, {
			'attributes.name': 1,
			'attributes.value': 1
        });
        await createIndex(models.productModel, {
            name: 'text',
            description: 'text'
        });

        winston.info('- Created indexes for: products');
    }

    const customersIndexes = await models.customerModel.listIndexes();

    if(customersIndexes.length === 1) {
        await createIndex(models.customerModel, {group_id: 1});
        await createIndex(models.customerModel, {email: 1}, {unique: true});
        await createIndex(models.customerModel, {mobile: 1})
        await createIndex(models.customerModel, {first_name: 1})
        await createIndex(models.customerModel, {last_name: 1})
        await createIndex(models.customerModel, {password: 1})
        await createIndex(models.customerModel, {
            full_name: 'text',
            'addresses.address1': 'text'
        }, {default_language: DEFAULT_LANGUAGE, name: 'textIndex'});
        winston.info('- Created indexes for: customers');
    }


    const ordersIndexes = await models.orderModel.listIndexes();

    if(ordersIndexes.length === 1) {
        await createIndex(models.orderModel, {draft: 1})
        await createIndex(models.orderModel, {number: 1})
        await createIndex(models.orderModel, {customer_id: 1})
        await createIndex(models.orderModel, {email: 1})
        await createIndex(models.orderModel, {mobile: 1})
        await createIndex(models.orderModel, {first_name: 1})
        await createIndex(models.orderModel, {last_name: 1})
        await createIndex(models.orderModel, {password: 1})
        await createIndex(models.orderModel, {
            'shipping_address.full_name': 'text',
            'shipping_address.address1': 'text'
        }, {default_language: DEFAULT_LANGUAGE, name: 'textIndex'});
        winston.info('- Created indexes for: orders');
    }
}

const addUser = async (userEmail) => {
    if (userEmail && userEmail.includes('@')) {
        const tokensCount = await models.tokenModel.countDocuments({
            email: userEmail
        });

        const tokensNotExists = tokensCount === 0;

		if (tokensNotExists) {
            await models.tokenModel.create({
                is_revoked: false,
				date_created: new Date(),
				expiration: 72,
				name: 'Owner',
				email: userEmail,
				scopes: ['admin']
            })
        }
        winston.info(`- Added token with email: ${userEmail}`);
    }
}

const addSettings = async ({domain}) => {
	if (domain && (domain.includes('https://') || domain.includes('http://'))) {
    await models.settingModel.updateOne({}, 
        { $set: { domain } }, 
        { upsert: true })
    winston.info(`- Set domain: ${domain}`);
    }
}

(async () => {
    mongoose.connect(config.mongoDbUrl, {useNewUrlParser: true, useFindAndModify: false}, (err) => {
        if(err) console.log(err);
        else console.log('Succesfull Connected to database'.green);
    })

    const userEmail = process.argv.length > 2 ? process.argv[2] : null;
	const domain = process.argv.length > 3 ? process.argv[3] : null;

    await addAllPages();
	await addAllProducts();
	await addOrderConfirmationEmailTemplates();
	await addForgotPasswordEmailTemplates_en();
	await addForgotPasswordEmailTemplates_ru();
	await addRegisterDoiEmailTemplates_en();
	await addRegisterDoiEmailTemplates_ru();
	await addShippingMethods();
	await addPaymentMethods();
	await createAllIndexes();
	await addUser(userEmail);
	await addSettings({
		domain
	});
})()