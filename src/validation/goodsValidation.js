import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { SIZES } from '../constants/sizes.js';

const objectIdValidator = (value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.message('Invalid ID value!');
  }
  return value;
};

export const getAllGoodsSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(1).max(12).default(12),

    // categoryId вместо category
    categoryId: Joi.string().custom(objectIdValidator),

    // sizes вместо size, и поддержка массива
    sizes: Joi.alternatives().try(
      Joi.string().valid(...SIZES),
      Joi.array().items(Joi.string().valid(...SIZES)),
    ),

    // minPrice/maxPrice вместо maxValue
    minPrice: Joi.number().integer().positive(),
    maxPrice: Joi.number().integer().positive(),

    // gender = male/female/unisex
    gender: Joi.string().valid('male', 'female', 'unisex'),
  }),
};
