

import { Router } from 'express';
import { celebrate } from 'celebrate';
import { createOrder, getAllOrders } from '../controllers/ordersController.js';
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

export default router;
