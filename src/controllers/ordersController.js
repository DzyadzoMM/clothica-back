import { Order } from "../models/order.js";

export const getAllOrders = async (req, res) => {
    const orders = await Order.find(
        { "userData.userId": req.user._id } 
    );
    res.status(200).json(orders);
};

export const createOrder = async (req, res, next) => {
    try {

        const { cart, status, userData } = req.body;

        let calculatedOrderTotal = 0;

        const validatedCart = cart.map(item => {

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
                userId: req.user._id, 
                ...userData, 
            },
        };

        const order = await Order.create(orderData);

        res.status(201).json(order);

    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Order creation failed", error: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    // оновлення статусу замовлення адміном

};
