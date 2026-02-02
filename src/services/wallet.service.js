import {
  ForbiddenOperationError,
  InsufficientFundsError,
} from '../errors/domain.errors.js';
import { NotFoundException } from '../errors/http.exceptions.js';

export class WalletService {
  constructor(walletRepo, tx) {
    this.walletRepo = walletRepo;
    this.tx = tx;
  }

  async addFunds(walletId, amount, ctx) {
    return this.tx.runInTransaction(async () => {
      const wallet = await this.walletRepo.findById(walletId);

      if (!wallet) {
        throw new NotFoundException('Wallet not found');
      }

      if (wallet.userId !== ctx.userId) {
        throw new ForbiddenOperationError('Not owner');
      }

      wallet.balance += amount;
      await this.walletRepo.save(wallet);
    });
  }

  async deductFunds(walletId, amount, ctx) {
    return this.tx.runInTransaction(async () => {
      const wallet = await this.walletRepo.findById(walletId);

      if (!wallet) {
        throw new NotFoundException('Wallet not found');
      }

      if (wallet.balance < amount) {
        throw new InsufficientFundsError('Insufficient funds');
      }

      wallet.balance -= amount;
      await this.walletRepo.save(wallet);
    });
  }
}
