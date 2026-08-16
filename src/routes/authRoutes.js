// src/routes/authRoutes.js

import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserSession,
  googleAuthCallback,
} from '../controllers/authController.js';
import {
  registerUserSchema,
  loginUserSchema,
} from '../validation/authValidation.js';
import passport from "passport";


const router = Router();

router.post('/api/auth/register', celebrate(registerUserSchema), registerUser);
router.post('/api/auth/login', celebrate(loginUserSchema), loginUser);
router.post('/api/auth/logout', logoutUser);
router.post('/api/auth/refresh', refreshUserSession);

// Google auth
router.get("/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get("/api/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/", session: false }),
  googleAuthCallback
);


export default router;
