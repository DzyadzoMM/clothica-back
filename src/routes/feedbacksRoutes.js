import { Router } from 'express';
import { celebrate } from 'celebrate';
import {createFeedback, getFeedbacks} from '../controllers/feedbacksController.js';
import { createFeedbackSchema } from '../validation/feedbacksValidation.js';

const router = Router();

//СТВОРЕННЯ запиту на підписку
router.post('/api/feedbacks/:productId', celebrate(createFeedbackSchema), createFeedback);

router.get('/api/feedbacks',getFeedbacks);

export default router;