import { Router } from 'express';
import { celebrate } from 'celebrate';
import { createOrder, getAllOrders } from '../controllers/ordersController.js';
import { createOrderSchema } from '../validation/ordersValidation.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.post('/api/orders', celebrate(createOrderSchema), createOrder);

router.get('/api/orders', authenticate, getAllOrders);

export default router;
