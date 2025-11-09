import { Router } from 'express';
import { celebrate } from 'celebrate';
import {createFeedback, getFeedbacks, getFeedbacksByProduct} from '../controllers/feedbacksController.js';
import { createFeedbackSchema, getFeedbacksByProductSchema } from '../validation/feedbacksValidation.js';

const router = Router();

//СТВОРЕННЯ запиту на підписку
router.post('/api/feedbacks/:productId', celebrate(createFeedbackSchema), createFeedback);

//Виведення всіх відгуків на головну сторінку
router.get('/api/feedbacks',getFeedbacks);

//Виведення відгуків на сторінку товару
router.get('/api/feedbacks/:productId', celebrate(getFeedbacksByProductSchema), getFeedbacksByProduct);

export default router;