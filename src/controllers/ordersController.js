

import { Order } from "../models/order.js";

export const getAllOrders = async (req, res) => {
    const orders = await Order.find(
        { "userData.userId": req.user._id } 
    );
    res.status(200).json(orders);
};

export const createOrder = async (req, res, next) => {
    try {
        const {
            cart,
            status,
            userData 
        } = req.body;

        const userId = req.user ? req.user._id : null; 

        let calculatedOrderTotal = 0;

        const validatedCart = cart.map(item => {
            const calculatedTotalPrice = item.amount * item.pricePerItem;
            
            const itemWithTotal = { 
                ...item, 
                totalPrice: calculatedTotalPrice 
            };
            calculatedOrderTotal += calculatedTotalPrice;
            return itemWithTotal;
        });

        const orderData = {
            cart: validatedCart,
            total: calculatedOrderTotal,
            userData: {
                userId: userId, 
                ...userData 
            },
            status, 
        };

        const order = await Order.create(orderData);
        res.status(201).json(order);

    } catch (error) {
        console.error("Order creation error:", error);
        next(error); 
    }
};

export const updateOrderStatus = async (req, res) => {
    res.status(501).json({ message: "Not Implemented" });
};
