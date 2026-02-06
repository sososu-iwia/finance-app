import mongoose from 'mongoose';
import { TransactionModel } from '../models/transaction.model.js';

export class SummaryService {
    async getSummary(ctx, filters = {}) {
        const match = {
            userId: new mongoose.Types.ObjectId(ctx.userId),
        };

        if (filters.from || filters.to) {
            match.date = {};
            if (filters.from) match.date.$gte = new Date(filters.from);
            if (filters.to) match.date.$lte = new Date(filters.to);
        }

        const totals = await TransactionModel.aggregate([
            { $match: match },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$amount' },
                },
            },
        ]);

        const income = totals.find((t) => t._id === 'income')?.total ?? 0;
        const expense = totals.find((t) => t._id === 'expense')?.total ?? 0;

        const byCategoryAgg = await TransactionModel.aggregate([
            { $match: { ...match, type: 'expense' } },
            { $group: { _id: '$category', total: { $sum: '$amount' } } },
            { $sort: { total: -1 } },
        ]);

        const byCategory = Object.fromEntries(byCategoryAgg.map((x) => [x._id, x.total]));

        return {
            income,
            expense,
            balance: income - expense,
            byCategory,
        };
    }
}
