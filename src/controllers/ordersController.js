

import Order  from "../models/order.js";

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


// 🟡 Отримати одне замовлення за ID
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('cart.goodId').populate('userData.userId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
};

// 🟠 Оновити замовлення
export const updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
};

// 🔴 Видалити замовлення
export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    next(err);
  }
};
