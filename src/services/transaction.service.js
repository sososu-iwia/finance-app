import { randomUUID } from 'crypto';
import { NotFoundException } from '../errors/http.exceptions.js';
import { FileStorage } from '../utils/file-storage.util.js';

export class TransactionService {
    constructor() {
        this.storage = new FileStorage('data/transactions.json');
    }

    async create(userId, data) {
        const transactions = await this.storage.read();

        const transaction = {
            id: randomUUID(),
            userId,
            type: data.type,
            amount: data.amount,
            category: data.category,
            date: data.date,
            note: data.note || '',
            createdAt: new Date().toISOString(),
        };

        transactions.push(transaction);
        await this.storage.write(transactions);

        return transaction;
    }

    async findAll(userId, filters = {}) {
        const transactions = await this.storage.read();

        let result = transactions.filter((t) => t.userId === userId);

        if (filters.type) {
            result = result.filter((t) => t.type === filters.type);
        }

        if (filters.category) {
            result = result.filter((t) => t.category === filters.category);
        }

        if (filters.from) {
            const fromDate = new Date(filters.from);
            result = result.filter((t) => new Date(t.date) >= fromDate);
        }

        if (filters.to) {
            const toDate = new Date(filters.to);
            result = result.filter((t) => new Date(t.date) <= toDate);
        }

        result.sort((a, b) => new Date(b.date) - new Date(a.date));

        return result;
    }

    async findById(userId, id) {
        const transactions = await this.storage.read();
        const transaction = transactions.find(
            (t) => t.id === id && t.userId === userId
        );

        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        return transaction;
    }

    async update(userId, id, data) {
        const transactions = await this.storage.read();
        const index = transactions.findIndex(
            (t) => t.id === id && t.userId === userId
        );

        if (index === -1) {
            throw new NotFoundException('Transaction not found');
        }

        transactions[index] = {
            ...transactions[index],
            ...data,
        };

        await this.storage.write(transactions);

        return transactions[index];
    }

    async delete(userId, id) {
        const transactions = await this.storage.read();
        const index = transactions.findIndex(
            (t) => t.id === id && t.userId === userId
        );

        if (index === -1) {
            throw new NotFoundException('Transaction not found');
        }

        transactions.splice(index, 1);
        await this.storage.write(transactions);
    }
}
