import Order from "../models/order.js";
import { sendPushNotification } from '../../utils/pushNotification.js';

export const getAllOrders = async (req, res, next) => {
    try {
        const userId = req.user ? (req.user._id || req.user.userId || req.user.id) : null;
        const orders = await Order.find({ "userData.userId": userId })
            .populate('cart.goodId'); 
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

export const createOrder = async (req, res, next) => {
    try {
        const {
            cart,
            status,
            userData 
        } = req.body;

        const userId = req.user ? (req.user._id || req.user.userId || req.user.id) : null; 

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

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body; 

    const order = await Order.findById(orderId).populate('userData.userId');
    
    if (!order) {
      return res.status(404).json({ message: 'Замовлення не знайдено' });
    }

    const oldStatus = order.status;
    order.status = status;
    await order.save();

    const targetUser = order.userData?.userId;

    if (oldStatus !== status && targetUser && targetUser.pushToken) {
      await sendPushNotification(
        targetUser.pushToken,
        'Оновлення замовлення 📦',
        `Статус вашого замовлення #${order._id} змінено на: "${status}"`,
        { orderId: order._id.toString() }
      );
    }

    res.status(200).json({ message: 'Статус успішно оновлено', order });
  } catch (error) {
    next(error);
  }
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
