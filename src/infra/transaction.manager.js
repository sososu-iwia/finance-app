export class TransactionManager {
  async runInTransaction(fn) {
    return fn();
  }
}
