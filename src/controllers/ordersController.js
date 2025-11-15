import { Order } from "../models/order.js";

export const getAllOrders = async (req, res) => {
    // Припускаємо, що аутентифікований користувач знаходиться у req.user._id
    const orders = await Order.find(
        { "userData.userId": req.user._id } // Шукаємо по вкладеному полю
    );
    res.status(200).json(orders);
};

export const createOrder = async (req, res, next) => {
    try {
        // Тепер очікуємо cart, status та userData як окремі об'єкти/поля
        const { cart, status, userData } = req.body;

        let calculatedOrderTotal = 0;

        const validatedCart = cart.map(item => {
            // item.pricePerItem існує завдяки оновленій Joi-валідації
            const calculatedTotalPrice = item.amount * item.pricePerItem;
            item.totalPrice = calculatedTotalPrice;
            calculatedOrderTotal += item.totalPrice;
            return item;
        });

        const orderData = {
            cart: validatedCart,
            total: calculatedOrderTotal,
            status: status,
            userData: {
                userId: req.user._id, // Беремо userId з аутентифікованого користувача
                ...userData, // Додаємо решту даних користувача
            },
        };

        const order = await Order.create(orderData);

        res.status(201).json(order);

    } catch (error) {
        // Це зловить помилки Mongoose або інші не-Joi помилки
        console.error(error);
        res.status(400).json({ message: "Order creation failed", error: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    // оновлення статусу замовлення адміном
    // Вам потрібно реалізувати цю логіку, використовуючи req.params.orderId та req.body.status
};
