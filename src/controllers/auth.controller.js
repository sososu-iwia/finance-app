import { Router } from 'express';
import { asyncHandler } from '../utils/async-handler.js';

export const authController = (authService) => {
  const router = Router();

  router.post(
    '/register',
    asyncHandler(async (req, res) => {
      const { email, password } = req.body;
      const user = await authService.register(email, password);
      res.status(201).json(user);
    })
  );

  router.post(
    '/login',
    asyncHandler(async (req, res) => {
      const { email, password } = req.body;
      const token = await authService.login(email, password);
      res.json(token);
    })
  );

  return router;
};
