import { Router } from 'express';
import {
  getCurrentUser,
  updateCurrentUser,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.get('/users/me', authenticate, getCurrentUser);
router.patch('/users/me', authenticate, updateCurrentUser);

export default router;
