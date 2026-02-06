import { Router } from 'express';
import { asyncHandler } from '../utils/async-handler.js';
import { validate } from '../validation/validation.middleware.js';
import { updateProfileSchema } from '../validation/auth.schemas.js';

export const userController = (userService) => {
  const router = Router();

  router.get(
    '/profile',
    asyncHandler(async (req, res) => {
      const profile = await userService.getProfile(req.user.userId);
      res.json(profile);
    })
  );

  router.put(
    '/profile',
    validate(updateProfileSchema),
    asyncHandler(async (req, res) => {
      const profile = await userService.updateProfile(req.user.userId, req.body);
      res.json(profile);
    })
  );

  return router;
};

