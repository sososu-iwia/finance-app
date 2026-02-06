import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './logging/logger.js';
import { connectDb } from './config/db.js';

import { TransactionManager } from './infra/transaction.manager.js';
import { UserRepository } from './infra/user.repository.js';
import { WalletRepository } from './infra/wallet.repository.js';

import { TokenService } from './auth/token.service.js';
import { AuthService } from './auth/auth.service.js';
import { WalletService } from './services/wallet.service.js';
import { TransactionService } from './services/transaction.service.js';
import { SummaryService } from './services/summary.service.js';
import { UserService } from './services/user.service.js';
import { MailService } from './services/mail.service.js';
import { ExpenseService } from './services/expense.service.js';
import { GoalService } from './services/goal.service.js';
import { FamilyBudgetService } from './services/family-budget.service.js';

const start = async () => {
  const db = await connectDb(env.DATABASE_URL);

  const userRepo = new UserRepository();
  const walletRepo = new WalletRepository();
  const tx = new TransactionManager();

  const tokenService = new TokenService(env.JWT_SECRET, '24h');
  const mailService = new MailService(env);
  const authService = new AuthService(userRepo, tokenService, mailService);
  const userService = new UserService(userRepo);
  const walletService = new WalletService(walletRepo, tx);
  const transactionService = new TransactionService();
  const summaryService = new SummaryService();
  const expenseService = new ExpenseService();
  const goalService = new GoalService();
  const familyBudgetService = new FamilyBudgetService();

  const app = createApp({
    db,
    tokenService,
    authService,
    userService,
    walletService,
    transactionService,
    summaryService,
    expenseService,
    goalService,
    familyBudgetService,
  });

  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`);
  });
};

start();

process.on('unhandledRejection', (err) => {
  logger.fatal({ err }, 'Unhandled Rejection');
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught Exception');
  process.exit(1);
});
