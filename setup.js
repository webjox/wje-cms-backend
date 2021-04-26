import winston from 'winston';
import mongoose from 'mongoose';
import path from 'path';
import fse from 'fs-extra';
import config from './config';
import models from './src/services/models';
import api from './src/services/api';

const getImagePath = async imageName => {
  const directory = path.resolve(`temp/${imageName}`);
  return directory;
};

const addPage = async pageObject => {
  try {
    const countOfDoc = await models.PageModel.countDocuments({
      slug: pageObject.slug,
    });
    const docExists = +countOfDoc > 0;
    if (!docExists) {
      await models.PageModel.create(pageObject);
      winston.info(`- Added page: /${pageObject.slug}`);
    }
  } catch (error) {
    console.log(`${error}`.red);
  }
};

const addAllPages = async () => {
  await addPage({
    slug: '',
    meta_title: 'Home',
    enabled: true,
    is_system: true,
  });
  await addPage({
    slug: 'checkout',
    meta_title: 'Checkout',
    enabled: true,
    is_system: true,
  });
  await addPage({
    slug: 'checkout-success',
    meta_title: 'Thank You!',
    enabled: true,
    is_system: true,
  });
  await addPage({
    slug: 'login',
    meta_title: 'Login',
    enabled: true,
    is_system: true,
  });
  await addPage({
    slug: 'register',
    meta_title: 'Register',
    enabled: true,
    is_system: true,
  });
  await addPage({
    slug: 'customer-account',
    meta_title: 'Customer Account',
    enabled: true,
    is_system: true,
  });
  await addPage({
    slug: 'forgot-password',
    meta_title: 'Forgot Password',
    enabled: true,
    is_system: true,
  });
  await addPage({
    slug: 'reset-password',
    meta_title: 'Reset Password',
    enabled: true,
    is_system: true,
  });
  await addPage({
    slug: 'delivery',
    meta_title: 'Доставка',
    enabled: true,
    is_system: true,
    content:
      '<h1 style="text-align: center;"><span style="font-size: 26px; color: rgb(0, 0, 0);">Условия доставки</span></h1><p><br></p><p><br></p><p><span style="font-size: 22px; color: rgb(0, 0, 0);">Доставка может быть осуществлена следующим способом:</span></p><p><span style="font-size: 22px; color: rgb(0, 0, 0);">— Курьером</span></p><p><span style="font-size: 22px; color: rgb(0, 0, 0);"><br></span></p><ul><li><span style="font-size: 22px; color: rgb(0, 0, 0);">Самовывоз: пер.Технологический, 3</span></li><li><span style="font-size: 22px; color: rgb(0, 0, 0);">Самовывоз: пр. Космонавтов 2/2 (ТРК «Вавилон»)</span></li><li><span style="font-size: 22px; color: rgb(0, 0, 0);">Самовывоз: ул. Малиновского, 25 (ТРК «Золотой Вавилон»)<br></span></li><li><span style="font-size: 22px; color: rgb(0, 0, 0);">Самовывоз: пр. Шолохова 104А (ТК «Прогресс»)<br></span></li><li><span style="font-size: 22px; color: rgb(0, 0, 0);">Самовывоз: пр. Михаила Нагибина, 17 (ТРК «РИО»)<br></span></li><li><span style="font-size: 22px; color: rgb(0, 0, 0);">Самовывоз: ул. Пойменная, 1 (ТРК «МегаМаг»)<br></span></li><li><span style="font-size: 22px; color: rgb(0, 0, 0);">Самовывоз: пр. Космонавтов 19а/28ж (ТЦ «Парк»)</span></li></ul><p><span style="font-size: 22px; color: rgb(0, 0, 0);"><br></span></p><p><span style="font-size: 22px; color: rgb(0, 0, 0);"><strong>Стоимость доставки:</strong></span></p><p><span style="font-size: 22px; color: rgb(0, 0, 0);"><br>Стоимость заказа для доставки — 2000 рублей. При заказе на меньшую сумму, воспользуйтесь доставкой Яндекс.Такси.</span></p><p><span style="font-size: 22px; color: rgb(0, 0, 0);"><br></span></p><p><span style="font-size: 22px; color: rgb(0, 0, 0);">Ростов-на-Дону — c 9:00 до 22:00 — 300 руб.; с 22:00 до 9:00 — 500 р.<br>Аксай, Батайск — 500 руб.<br>Новочеркасск, Азов — 1000 руб.<br>Таганрог, Шахты — 2000 руб.</span></p>',
    sidebar: true,
  });
  await addPage({
    slug: 'return-of-the-goods',
    meta_title: 'Возврат товаров',
    enabled: true,
    is_system: true,
    content:
      '<p><br></p><h3 style="text-align: center;"><span style="font-size: 28px; color: rgb(0, 0, 0);">Возврат товара</span></h3><p><span style="color: rgb(0, 0, 0);"><br></span></p><p><span style="color: rgb(0, 0, 0);"><br></span></p><p><span style="font-size: 26px; color: rgb(0, 0, 0);">Срок возврата товара надлежащего качества составляет <strong>14 дней с момента получения товара</strong>. Согласно Постановлением Правительства РФ от 19.01.1998 г. № 55 пиротехника и воздушные шары надлежащего качества обмену и возврату не подлежат</span></p><p><span style="font-size: 26px; color: rgb(0, 0, 0);">Возврат переведённых средств, производится на ваш банковский счёт<strong> в течение 5-30 рабочих дней</strong> (срок зависит от банка, который выдал вашу банковскую карту).</span></p>',
    sidebar: true,
  });
  await addPage({
    slug: 'wholesale-customers',
    meta_title: 'Оптовым клиентам',
    enabled: true,
    is_system: true,
    sidebar: true,
  });
};

const addAllProducts = async () => {
  const productCategoriesCount = await models.CategoryModel.countDocuments({});
  const productsCount = await models.ProductModel.countDocuments({});
  const productsNotExists = productCategoriesCount === 0 && productsCount === 0;
  if (productsNotExists) {
    try {
      const pyrotech = await models.CategoryModel.create({
        name: 'Пиротехника',
        parent_id: null,
        enabled: true,
      });
      const holidays = await models.CategoryModel.create({
        name: 'Товары для праздника',
        parent_id: null,
        enabled: true,
      });

      let category = await models.CategoryModel.create({
        name: 'Бенгальские огни и хлопушки',
        enabled: true,
        parent_id: pyrotech._id,
      });
      let imageName = 'image 69.png';
      let imagePath = await getImagePath(imageName);
      let object = {
        path: imagePath,
        name: imageName,
      };
      await api.categories.uploadCategoryImage(object, category._id);

      category = await models.CategoryModel.create({
        name: 'Петарды',
        enabled: true,
        parent_id: pyrotech._id,
      });
      imageName = 'image 70.png';
      imagePath = await getImagePath(imageName);
      object = {
        path: imagePath,
        name: imageName,
      };
      await api.categories.uploadCategoryImage(object, category._id);

      category = await models.CategoryModel.create({
        name: 'Наземные и летающие фейерверки',
        enabled: true,
        parent_id: pyrotech._id,
      });
      imageName = 'image 71.png';
      imagePath = await getImagePath(imageName);
      object = {
        path: imagePath,
        name: imageName,
      };
      await api.categories.uploadCategoryImage(object, category._id);

      category = await models.CategoryModel.create({
        name: 'Ракеты',
        enabled: true,
        parent_id: pyrotech._id,
      });
      imageName = 'image 72.png';
      imagePath = await getImagePath(imageName);
      object = {
        path: imagePath,
        name: imageName,
      };
      await api.categories.uploadCategoryImage(object, category._id);

      category = await models.CategoryModel.create({
        name: 'Фонтаны',
        enabled: true,
        parent_id: pyrotech._id,
      });
      imageName = 'image 73.png';
      imagePath = await getImagePath(imageName);
      object = {
        path: imagePath,
        name: imageName,
      };
      await api.categories.uploadCategoryImage(object, category._id);

      category = await models.CategoryModel.create({
        name: 'Дневные фейерверки',
        enabled: true,
        parent_id: pyrotech._id,
      });
      imageName = 'image 74.png';
      imagePath = await getImagePath(imageName);
      object = {
        path: imagePath,
        name: imageName,
      };
      await api.categories.uploadCategoryImage(object, category._id);

      category = await models.CategoryModel.create({
        name: 'Комбинированные изделия',
        enabled: true,
        parent_id: pyrotech._id,
      });
      imageName = 'image 75.png';
      imagePath = await getImagePath(imageName);
      object = {
        path: imagePath,
        name: imageName,
      };
      await api.categories.uploadCategoryImage(object, category._id);

      category = await models.CategoryModel.create({
        name: 'Римские свечи',
        enabled: true,
        parent_id: pyrotech._id,
      });
      imageName = 'image 76.png';
      imagePath = await getImagePath(imageName);
      object = {
        path: imagePath,
        name: imageName,
      };
      await api.categories.uploadCategoryImage(object, category._id);

      category = await models.CategoryModel.create({
        name: 'Фестивальные шары',
        enabled: true,
        parent_id: pyrotech._id,
      });
      imageName = 'image 77.png';
      imagePath = await getImagePath(imageName);
      object = {
        path: imagePath,
        name: imageName,
      };
      await api.categories.uploadCategoryImage(object, category._id);

      category = await models.CategoryModel.create({
        name: 'Батареи салютов',
        enabled: true,
        parent_id: pyrotech._id,
      });
      imageName = 'image 78.png';
      imagePath = await getImagePath(imageName);
      object = {
        path: imagePath,
        name: imageName,
      };
      await api.categories.uploadCategoryImage(object, category._id);

      //

      category = await models.CategoryModel.create({
        name: 'Латексные шары',
        enabled: true,
        parent_id: holidays._id,
      });
      imageName = 'image 79.png';
      imagePath = await getImagePath(imageName);
      object = {
        path: imagePath,
        name: imageName,
      };
      await api.categories.uploadCategoryImage(object, category._id);

      category = await models.CategoryModel.create({
        name: 'Фольгированные шары',
        enabled: true,
        parent_id: holidays._id,
      });
      imageName = 'image 80.png';
      imagePath = await getImagePath(imageName);
      object = {
        path: imagePath,
        name: imageName,
      };
      await api.categories.uploadCategoryImage(object, category._id);

      category = await models.CategoryModel.create({
        name: 'Сервировка стола',
        enabled: true,
        parent_id: holidays._id,
      });
      imageName = 'image 81.png';
      imagePath = await getImagePath(imageName);
      object = {
        path: imagePath,
        name: imageName,
      };
      await api.categories.uploadCategoryImage(object, category._id);

      category = await models.CategoryModel.create({
        name: 'Свечи для торта',
        enabled: true,
        parent_id: holidays._id,
      });
      imageName = 'image 82.png';
      imagePath = await getImagePath(imageName);
      object = {
        path: imagePath,
        name: imageName,
      };
      await api.categories.uploadCategoryImage(object, category._id);

      category = await models.CategoryModel.create({
        name: 'Декор интерьера',
        enabled: true,
        parent_id: holidays._id,
      });
      imageName = 'image 83.png';
      imagePath = await getImagePath(imageName);
      object = {
        path: imagePath,
        name: imageName,
      };
      await api.categories.uploadCategoryImage(object, category._id);

      category = await models.CategoryModel.create({
        name: 'Украшение для человека',
        enabled: true,
        parent_id: holidays._id,
      });
      imageName = 'image 84.png';
      imagePath = await getImagePath(imageName);
      object = {
        path: imagePath,
        name: imageName,
      };
      await api.categories.uploadCategoryImage(object, category._id);

      category = await models.CategoryModel.create({
        name: 'Праздничные товары',
        enabled: true,
        parent_id: holidays._id,
      });
      imageName = 'image 85.png';
      imagePath = await getImagePath(imageName);
      object = {
        path: imagePath,
        name: imageName,
      };
      await api.categories.uploadCategoryImage(object, category._id);

      category = await models.CategoryModel.create({
        name: 'Игры, игрушки',
        enabled: true,
        parent_id: holidays._id,
      });
      imageName = 'image 86.png';
      imagePath = await getImagePath(imageName);
      object = {
        path: imagePath,
        name: imageName,
      };
      await api.categories.uploadCategoryImage(object, category._id);

      category = await models.CategoryModel.create({
        name: 'Гелий и оборудование',
        enabled: true,
        parent_id: holidays._id,
      });
      imageName = 'image 87.png';
      imagePath = await getImagePath(imageName);
      object = {
        path: imagePath,
        name: imageName,
      };
      await api.categories.uploadCategoryImage(object, category._id);

      winston.info('- Added products');
    } catch (error) {
      console.log(`${error}.red`);
    }
  }
};

const addOrderConfirmationEmailTemplates = async () => {
  const emailTemplatesCount = await models.EmailTemplatesModel.countDocuments({
    name: 'order_confirmation',
  });
  const emailTemplatesNotExists = emailTemplatesCount === 0;
  if (emailTemplatesNotExists) {
    await models.EmailTemplatesModel.create({
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
		  
		  </div>`,
    });
    winston.info('- Added email template for Order Confirmation');
  }
};

const addForgotPasswordEmailTemplates_en = async () => {
  const emailTemplatesCount = await models.EmailTemplatesModel.countDocuments({
    name: 'forgot_password_en',
  });
  const emailTemplatesNotExists = emailTemplatesCount === 0;
  if (emailTemplatesNotExists) {
    await models.EmailTemplatesModel.create({
      name: 'forgot_password_en',
      link: 'reset password',
      subject: `Password Reset on `,
      body: `<div style="line-height: 30px">
			<div><b>You requested on {{shop_name}} a password reset.</b><div>
			<div><b>Please click on the link bellow to get back to {{shop_name}} to reset your password.</b><div>
			<div><b>Link:</b> {{forgot_password_link}}<div>

		  </div>`,
    });
    winston.info('- Added email template for Password Reset English');
  }
};

const addForgotPasswordEmailTemplates_ru = async () => {
  const emailTemplatesCount = await models.EmailTemplatesModel.countDocuments({
    name: 'forgot_password_ru',
  });
  const emailTemplatesNotExists = emailTemplatesCount === 0;
  if (emailTemplatesNotExists) {
    await models.EmailTemplatesModel.create({
      name: 'forgot_password_ru',
      link: 'Сбросить пароль',
      subject: `Сброс пароля`,
      body: `<div style="line-height: 30px">
			<div><b>Вы запросили сброс пароля.</b><div>
			<div><b>Пожалуйста, перейдите по указанной ссылке для сброса пароля.</b><div>
			<div><b>Ссылка:</b> {{forgot_password_link}}<div>

		  </div>`,
    });
    winston.info('- Added email template for Password Reset Russian');
  }
};

const addRegisterDoiEmailTemplates_en = async () => {
  const emailTemplatesCount = await models.EmailTemplatesModel.countDocuments({
    name: 'register_doi_en',
  });
  const emailTemplatesNotExists = emailTemplatesCount === 0;
  if (emailTemplatesNotExists) {
    await models.EmailTemplatesModel.create({
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

		  </div>`,
    });
    winston.info('- Added email template for Account Activation English');
  }
};

const addRegisterDoiEmailTemplates_ru = async () => {
  const emailTemplatesCount = await models.EmailTemplatesModel.countDocuments({
    name: 'register_doi_ru',
  });
  const emailTemplatesNotExists = emailTemplatesCount === 0;
  if (emailTemplatesNotExists) {
    await models.EmailTemplatesModel.create({
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

		  </div>`,
    });
    winston.info('- Added email template for Account Activation Russian');
  }
};

const addShippingMethods = async () => {
  const shippingMethodsCount = await models.OrderShippingModel.countDocuments({});
  const shippingMethodsNotExists = shippingMethodsCount === 0;
  if (shippingMethodsNotExists) {
    await models.OrderShippingModel.create({
      name: 'Courier Service',
      enabled: true,
      conditions: {
        countries: [],
        states: [],
        cities: [],
        subtotal_min: 0,
        subtotal_max: 0,
        weight_total_min: 0,
        weight_total_max: 0,
      },
    });
    winston.info('- Added shipping method');
  }
};

const addSettings = async ({ domain }) => {
  if (domain && (domain.includes('https://') || domain.includes('http://'))) {
    await models.SettingModel.updateOne({}, { $set: { domain } }, { upsert: true });
    winston.info(`- Set domain: ${domain}`);
  }
};

(async () => {
  mongoose.connect(config.mongoDbUrl, { useNewUrlParser: true, useFindAndModify: false }, err => {
    if (err) console.log(err);
    else console.log('Succesfull Connected to database'.green);
  });

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
  await addSettings({
    domain,
  });
})();
