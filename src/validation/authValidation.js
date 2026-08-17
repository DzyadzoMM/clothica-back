import { Joi, Segments } from 'celebrate';

export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^\+380\d{9}$/),
    password: Joi.string().min(8).required(),
    city: Joi.string().optional(),
    postOfficeNum: Joi.string().optional(),
  }).xor('email', 'phone'), 
};

export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^\+380\d{9}$/),
    password: Joi.string().required(),
  }).xor('email', 'phone'), 
};
