import { FileStorage } from '../utils/file-storage.util.js';

export class SummaryService {
    constructor() {
        this.storage = new FileStorage('data/transactions.json');
    }

    async getSummary(userId, filters = {}) {
        const transactions = await this.storage.read();

        let userTransactions = transactions.filter((t) => t.userId === userId);

        if (filters.from) {
            const fromDate = new Date(filters.from);
            userTransactions = userTransactions.filter(
                (t) => new Date(t.date) >= fromDate
            );
        }

        if (filters.to) {
            const toDate = new Date(filters.to);
            userTransactions = userTransactions.filter(
                (t) => new Date(t.date) <= toDate
            );
        }

        let income = 0;
        let expense = 0;
        const byCategory = {};

        for (const transaction of userTransactions) {
            if (transaction.type === 'income') {
                income += transaction.amount;
            } else if (transaction.type === 'expense') {
                expense += transaction.amount;

                if (!byCategory[transaction.category]) {
                    byCategory[transaction.category] = 0;
                }
                byCategory[transaction.category] += transaction.amount;
            }
        }

        const balance = income - expense;

        return {
            income,
            expense,
            balance,
            byCategory,
        };
    }
}
