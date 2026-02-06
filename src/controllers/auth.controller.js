import { Router } from 'express';
import { asyncHandler } from '../utils/async-handler.js';
import { validate } from '../validation/validation.middleware.js';
import { loginSchema, registerSchema } from '../validation/auth.schemas.js';

export const authController = (authService) => {
  const router = Router();

  router.post(
    '/register',
    validate(registerSchema),
    asyncHandler(async (req, res) => {
      const { email, password } = req.body;
      const user = await authService.register(email, password);
      res.status(201).json(user);
    })
  );

  router.post(
    '/login',
    validate(loginSchema),
    asyncHandler(async (req, res) => {
      const { email, password } = req.body;
      const token = await authService.login(email, password);
      res.json(token);
    })
  );

  return router;
};
