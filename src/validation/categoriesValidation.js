import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';


const objectIdValidator = (value, helpers) => {
  const isValidId =  isValidObjectId(value);

  return !isValidId ? helpers.message("Invalid id format") : value;
};

export const categoryIdSchema = {
  [Segments.PARAMS]: Joi.object({
    categoryId: Joi.string().custom(objectIdValidator).required(),
  }),
};


export const getAllCategoriesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(1).max(12).default(12),
  }),
};