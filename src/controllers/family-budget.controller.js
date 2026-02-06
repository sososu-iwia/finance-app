import { Router } from 'express';
import { asyncHandler } from '../utils/async-handler.js';
import { validate } from '../validation/validation.middleware.js';
import {
  createFamilyBudgetSchema,
  updateFamilyBudgetSchema,
  addMemberSchema,
} from '../validation/family-budget.schemas.js';

export const familyBudgetController = (familyBudgetService) => {
  const router = Router();

  router.get(
    '/',
    asyncHandler(async (req, res) => {
      const budgets = await familyBudgetService.findAll(req.user);
      res.json(budgets);
    })
  );

  router.post(
    '/',
    validate(createFamilyBudgetSchema),
    asyncHandler(async (req, res) => {
      const budget = await familyBudgetService.create(req.user, req.body);
      res.status(201).json(budget);
    })
  );

  router.get(
    '/:id',
    asyncHandler(async (req, res) => {
      const budget = await familyBudgetService.findById(req.user, req.params.id);
      res.json(budget);
    })
  );

  router.put(
    '/:id',
    validate(updateFamilyBudgetSchema),
    asyncHandler(async (req, res) => {
      const budget = await familyBudgetService.update(req.user, req.params.id, req.body);
      res.json(budget);
    })
  );

  router.delete(
    '/:id',
    asyncHandler(async (req, res) => {
      await familyBudgetService.delete(req.user, req.params.id);
      res.sendStatus(204);
    })
  );

  router.post(
    '/:id/members',
    validate(addMemberSchema),
    asyncHandler(async (req, res) => {
      const budget = await familyBudgetService.addMember(
        req.user,
        req.params.id,
        req.body.userId
      );
      res.status(201).json(budget);
    })
  );

  router.delete(
    '/:id/members/:userId',
    asyncHandler(async (req, res) => {
      const budget = await familyBudgetService.removeMember(
        req.user,
        req.params.id,
        req.params.userId
      );
      res.json(budget);
    })
  );

  return router;
};
