import { Router } from 'express';
import { asyncHandler } from '../utils/async-handler.js';
import { validate, validateQuery } from '../validation/validation.middleware.js';
import {
  createGoalSchema,
  updateGoalSchema,
  queryGoalSchema,
} from '../validation/goal.schemas.js';

export const goalController = (goalService) => {
  const router = Router();

  router.get(
    '/',
    validateQuery(queryGoalSchema),
    asyncHandler(async (req, res) => {
      const goals = await goalService.findAll(req.user, req.query);
      res.json(goals);
    })
  );

  router.post(
    '/',
    validate(createGoalSchema),
    asyncHandler(async (req, res) => {
      const goal = await goalService.create(req.user, req.body);
      res.status(201).json(goal);
    })
  );

  router.get(
    '/:id',
    asyncHandler(async (req, res) => {
      const goal = await goalService.findById(req.user, req.params.id);
      res.json(goal);
    })
  );

  router.put(
    '/:id',
    validate(updateGoalSchema),
    asyncHandler(async (req, res) => {
      const goal = await goalService.update(req.user, req.params.id, req.body);
      res.json(goal);
    })
  );

  router.delete(
    '/:id',
    asyncHandler(async (req, res) => {
      await goalService.delete(req.user, req.params.id);
      res.sendStatus(204);
    })
  );

  return router;
};
