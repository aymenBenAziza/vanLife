import { Router } from 'express';

import {
  getProfile,
  login,
  logout,
  refresh,
  signup,
  updateProfile,
} from './auth.controller.js';
import { authenticate, authorize, validateRequest } from './auth.middleware.js';
import { loginSchema, signupSchema, updateProfileSchema } from './auth.validation.js';

export const authRouter = Router();

authRouter.post('/signup', validateRequest(signupSchema), signup);
authRouter.post('/login', validateRequest(loginSchema), login);
authRouter.post('/refresh', refresh);
authRouter.post('/logout', logout);
authRouter.get('/me', authenticate, authorize('admin', 'staff', 'customer'), getProfile);
authRouter.patch(
  '/me',
  authenticate,
  authorize('admin', 'staff', 'customer'),
  validateRequest(updateProfileSchema),
  updateProfile
);
