import { Router } from 'express';
import { celebrate } from 'celebrate';
import {createSubscription} from '../controllers/subscriptionsController.js';
import { createSubscriptionSchema } from '../validations/subscriptionsValidation.js';

const router = Router();

//СТВОРЕННЯ запиту на підписку
router.post('/api/subscriptions', celebrate(createSubscriptionSchema), createSubscription);

export default router;