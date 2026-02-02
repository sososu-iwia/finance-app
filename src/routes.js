import { Router } from 'express';

import { authMiddleware } from './auth/auth.middleware.js';

import { authController } from './controllers/auth.controller.js';
import { walletController } from './controllers/wallet.controller.js';
import { expenseController } from './controllers/expense.controller.js';
import { goalController } from './controllers/goal.controller.js';
import { familyBudgetController } from './controllers/family-budget.controller.js';

export const routes = (deps) => {
  const router = Router();

  // Public routes
  router.use('/auth', authController(deps.authService));

  // Protected routes
  router.use(authMiddleware(deps.tokenService));

  router.use('/wallets', walletController(deps.walletService));
  router.use('/expenses', expenseController(deps.expenseService));
  router.use('/goals', goalController(deps.goalService));
  router.use(
    '/family-budgets',
    familyBudgetController(deps.familyBudgetService)
  );

  return router;
};
