import { Joi, Segments } from "celebrate";
import { isValidObjectId } from "mongoose";
import { SIZES } from "../constants/sizes.js";
import { STATUS } from "../constants/status.js";

const objectIdValidator = (value, helpers) => {
    const isValidId = isValidObjectId(value);
    return !isValidId ? helpers.message("Invalid ID value!") : value;
};

// export const cartItemSchema = {
//     [Segments.BODY]: Joi.object({
//         goodId: Joi.string().required(),
//         size: Joi.string().valid(...SIZES),
//         amount: Joi.number().integer().positive().min(1).default(1),
//     })
// };

export const cartItemSchema = Joi.object({
    goodId: Joi.string().required(),
    size: Joi.string().valid(...SIZES),
    amount: Joi.number().integer().positive().min(1).default(1),
});

export const createOrderSchema = {
    [Segments.BODY]: Joi.object({
        cart: Joi.array().items(cartItemSchema).min(1).required(),
        status: Joi.string().valid(...STATUS).required(),
        userData: Joi.object({
            userId: Joi.string().custom(objectIdValidator).required(),
            firstName: Joi.string().trim().required(),
            lastName: Joi.string().trim().required(),
            phone: Joi.string().trim().required(),
            city: Joi.string().trim().required(),
            postOfficeNum: Joi.string().trim().required(),
            comment: Joi.string().trim().allow("").max(500).optional(),
        })
    })
};
