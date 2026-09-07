import { Router } from 'express';
import {
  getCurrentUser,
  updateCurrentUser,
  updatePushToken,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.get('/api/users/me', authenticate, getCurrentUser);
router.patch('/api/users/me', authenticate, updateCurrentUser);
router.patch('/api/users/push-token', authenticate, updatePushToken);

export default router;
