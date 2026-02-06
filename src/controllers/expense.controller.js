import { Router } from 'express';
import { asyncHandler } from '../utils/async-handler.js';
import { validate, validateQuery } from '../validation/validation.middleware.js';
import {
  createExpenseSchema,
  updateExpenseSchema,
  queryExpenseSchema,
} from '../validation/expense.schemas.js';

export const expenseController = (expenseService) => {
  const router = Router();

  router.get(
    '/',
    validateQuery(queryExpenseSchema),
    asyncHandler(async (req, res) => {
      const expenses = await expenseService.findAll(req.user, req.query);
      res.json(expenses);
    })
  );

  router.post(
    '/',
    validate(createExpenseSchema),
    asyncHandler(async (req, res) => {
      const expense = await expenseService.create(req.user, req.body);
      res.status(201).json(expense);
    })
  );

  router.get(
    '/:id',
    asyncHandler(async (req, res) => {
      const expense = await expenseService.findById(req.user, req.params.id);
      res.json(expense);
    })
  );

  router.put(
    '/:id',
    validate(updateExpenseSchema),
    asyncHandler(async (req, res) => {
      const expense = await expenseService.update(req.user, req.params.id, req.body);
      res.json(expense);
    })
  );

  router.delete(
    '/:id',
    asyncHandler(async (req, res) => {
      await expenseService.delete(req.user, req.params.id);
      res.sendStatus(204);
    })
  );

  return router;
};
