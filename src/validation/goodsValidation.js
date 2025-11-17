import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { SIZES } from '../constants/sizes.js';

export const getAllGoodsSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(1).max(12).default(12),
    categoryId: Joi.string(),
    sizes: Joi.array().items(Joi.string().valid(...SIZES)),
    minPrice: Joi.number().integer().min(0),
    maxPrice: Joi.number().integer().positive(),
    gender: Joi.string().valid('man', 'women', 'unisex', 'all'),
  }),
};

const objectIdValidator = (value, helpers) => {
  const isValidId = isValidObjectId(value);
  return !isValidId ? helpers.message('Invalid ID value!') : value;
};

export const goodIdSchema = {
  [Segments.PARAMS]: Joi.object({
    goodId: Joi.string().custom(objectIdValidator).required(),
  }),
};
