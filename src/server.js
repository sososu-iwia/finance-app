import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './logging/logger.js';

import { TransactionManager } from './infra/transaction.manager.js';
import { UserRepository } from './infra/user.repository.js';
import { WalletRepository } from './infra/wallet.repository.js';

import { TokenService } from './auth/token.service.js';
import { AuthService } from './auth/auth.service.js';
import { WalletService } from './services/wallet.service.js';
import { TransactionService } from './services/transaction.service.js';
import { SummaryService } from './services/summary.service.js';

const database = {
  async ping() {
    return true;
  },
};

const userRepo = new UserRepository();
const walletRepo = new WalletRepository();
const tx = new TransactionManager();

const tokenService = new TokenService(env.JWT_SECRET, '24h');
const authService = new AuthService(userRepo, tokenService);
const walletService = new WalletService(walletRepo, tx);
const transactionService = new TransactionService();
const summaryService = new SummaryService();

const expenseService = {};
const goalService = {};
const familyBudgetService = {};

const app = createApp({
  db: database,
  tokenService,
  authService,
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

process.on('unhandledRejection', (err) => {
  logger.fatal({ err }, 'Unhandled Rejection');
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught Exception');
  process.exit(1);
});
