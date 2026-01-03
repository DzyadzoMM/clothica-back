

import { Router } from 'express';
import { celebrate } from 'celebrate';
import { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder, } from '../controllers/ordersController.js';
import { createOrderSchema } from '../validation/ordersValidation.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

const optionalAuthenticate = (req, res, next) => {
    authenticate(req, res, (err) => {
        if (err && err.status === 401) {
            req.user = null; 
            return next();
        }
        next(err); 
    });
};

router.post('/api/orders', optionalAuthenticate, celebrate(createOrderSchema), createOrder);

router.get('/api/orders', authenticate, getAllOrders);

router.get('/api/orders/:id', authenticate, getOrderById); 
router.put('/api/orders/:id', authenticate, updateOrder); 
router.delete('/api/orders/:id', authenticate, deleteOrder);

export default router;
