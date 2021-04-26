import { Schema } from 'mongoose';

const emailTemplatesSchema = new Schema(
  {
    name: {
      type: String,
      default: 'Default_template',
    },
    link: {
      type: String,
      default: 'Default link',
    },
    subject: {
      type: String,
      default: 'Default subject',
    },
    body: {
      type: String,
      default:
        '<div style="line-height: 30px">\n\t\t\t<div><b>Тестовое письмо.</b><div>\n\t\t\t<div><b>Пожалуйста, проверьте работу указанной ссылки.</b></div>\n\n\t\t  </div>',
    },
  },
  { versionKey: false },
);

export default emailTemplatesSchema;
