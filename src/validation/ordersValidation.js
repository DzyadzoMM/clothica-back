// orders.validation.js

import { Joi, Segments } from "celebrate";
import { isValidObjectId } from "mongoose";
import { SIZES } from "../constants/sizes.js";
import { STATUS } from "../constants/status.js";

// 1. Користувацький валідатор для перевірки ObjectId
const objectIdValidator = (value, helpers) => {
    const isValidId = isValidObjectId(value);
    // Якщо ID не валідний, повертаємо повідомлення про помилку
    return !isValidId ? helpers.message("Invalid ID value!") : value;
};

// 2. Схема Joi для одного товару в кошику
export const cartItemJoiObject = Joi.object({
    goodId: Joi.string().custom(objectIdValidator).required(),
    pricePerItem: Joi.number().positive().required(), 
    size: Joi.string().valid(...SIZES),
    amount: Joi.number().integer().positive().min(1).default(1),
});

// 3. Схема Celebrate для перевірки тіла запиту, що містить один товар
export const cartItemSchema = {
    [Segments.BODY]: cartItemJoiObject
};

// 4. Схема Celebrate для створення замовлення
export const createOrderSchema = {
    [Segments.BODY]: Joi.object({
    
        cart: Joi.array().items(cartItemJoiObject).min(1).required(), 
        status: Joi.string().valid(...STATUS).required(),
        
        // 🔥 ВИПРАВЛЕНО: Об'єкт схеми для userData тепер правильно обгорнутий
        // у фігурні дужки {} як аргумент Joi.object().
        userData: Joi.object({ 
            firstName: Joi.string().trim().required(),
            lastName: Joi.string().trim().required(),
            phone: Joi.string().trim().required(),
            city: Joi.string().trim().required(),
            postOfficeNum: Joi.string().trim().required(),
            comment: Joi.string().trim().allow("").max(500).optional(),
        }).required() 
        
    }).required() // Закриваємо Joi.object() для Segments.BODY
};
