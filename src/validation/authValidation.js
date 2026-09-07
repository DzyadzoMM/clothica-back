import { Joi, Segments } from 'celebrate';

export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    firstName: Joi.string().required(),
    phone: Joi.string()
      .pattern(/^\+380\d{9}$/)
      .required(),
    password: Joi.string().min(8).required(),
    email: Joi.string().allow('', null).optional()
  }),
};
export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    phone: Joi.string()
      .pattern(/^\+380\d{9}$/)
      .required(),
    password: Joi.string().required(),
  }),
};
