import { Joi, Segments } from "celebrate";
import { isValidObjectId } from "mongoose";
import { SIZES } from "../constants/sizes.js";

export const getAllGoodsSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(1).max(12).default(12),
    category: Joi.string(),
    size: Joi.string().valid(...SIZES),
    maxValue: Joi.number().integer().positive(),
    gender: Joi.string().valid("men", "women", "unisex"),
  }),
};

const objectIdValidator = (value, helpers) => {
  const isValidId = isValidObjectId(value);
  return !isValidId ? helpers.message("Invalid ID value!") : value;
};

export const goodIdSchema = {
  [Segments.PARAMS]: Joi.object({
    goodId: Joi.string().custom(objectIdValidator).required(),
  })
};
