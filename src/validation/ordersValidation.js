import { Joi, Segments } from "celebrate";
import { isValidObjectId } from "mongoose";
import { SIZES } from "../constants/sizes.js";
import { STATUS } from "../constants/status.js";

const objectIdValidator = (value, helpers) => {
    const isValidId = isValidObjectId(value);
    return !isValidId ? helpers.message("Invalid ID value!") : value;
};

// Експортуємо сам Joi-об'єкт для використання у масиві
export const cartItemJoiObject = Joi.object({
    goodId: Joi.string().custom(objectIdValidator).required(),
    // Додано pricePerItem, яке потрібне контролеру для розрахунку
    pricePerItem: Joi.number().positive().required(), 
    size: Joi.string().valid(...SIZES),
    amount: Joi.number().integer().positive().min(1).default(1),
});

// Обгорнута схема для Joi-валідації тіла (якщо вона потрібна окремо)
export const cartItemSchema = {
    [Segments.BODY]: cartItemJoiObject
};

export const createOrderSchema = {
    [Segments.BODY]: Joi.object({
        // Використовуємо експортований Joi-об'єкт
        cart: Joi.array().items(cartItemJoiObject).min(1).required(), 
        status: Joi.string().valid(...STATUS).required(),
        // Поля користувача зібрані в userData, як і вимагає Joi-схема
        userData: Joi.object({
            // userId не валідуємо тут, оскільки він береться з req.user._id
            firstName: Joi.string().trim().required(),
            lastName: Joi.string().trim().required(),
            phone: Joi.string().trim().required(),
            city: Joi.string().trim().required(),
            postOfficeNum: Joi.string().trim().required(),
            comment: Joi.string().trim().allow("").max(500).optional(),
        }).required() // userData має бути обов'язковим
    })
};
