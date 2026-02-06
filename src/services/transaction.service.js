import mongoose from 'mongoose';
import { NotFoundException } from '../errors/http.exceptions.js';
import { ForbiddenOperationError } from '../errors/domain.errors.js';
import { TransactionModel } from '../models/transaction.model.js';
import { Role } from '../auth/roles.js';

export class TransactionService {
    async create(ctx, data) {
        const tx = await TransactionModel.create({
            userId: new mongoose.Types.ObjectId(ctx.userId),
            type: data.type,
            amount: data.amount,
            category: data.category,
            date: new Date(data.date),
            note: data.note || '',
        });

        return {
            id: tx._id.toString(),
            userId: tx.userId.toString(),
            type: tx.type,
            amount: tx.amount,
            category: tx.category,
            date: tx.date,
            note: tx.note,
            createdAt: tx.createdAt,
            updatedAt: tx.updatedAt,
        };
    }

    async findAll(ctx, filters = {}) {
        const query = { userId: new mongoose.Types.ObjectId(ctx.userId) };

        if (filters.type) query.type = filters.type;
        if (filters.category) query.category = filters.category;
        if (filters.from || filters.to) {
            query.date = {};
            if (filters.from) query.date.$gte = new Date(filters.from);
            if (filters.to) query.date.$lte = new Date(filters.to);
        }

        const items = await TransactionModel.find(query).sort({ date: -1 }).lean();
        return items.map((t) => ({
            id: t._id.toString(),
            userId: t.userId.toString(),
            type: t.type,
            amount: t.amount,
            category: t.category,
            date: t.date,
            note: t.note,
            createdAt: t.createdAt,
            updatedAt: t.updatedAt,
        }));
    }

    async findById(ctx, id) {
        const tx = await TransactionModel.findOne({
            _id: id,
            userId: new mongoose.Types.ObjectId(ctx.userId),
        }).lean();

        if (!tx) throw new NotFoundException('Transaction not found');

        return {
            id: tx._id.toString(),
            userId: tx.userId.toString(),
            type: tx.type,
            amount: tx.amount,
            category: tx.category,
            date: tx.date,
            note: tx.note,
            createdAt: tx.createdAt,
            updatedAt: tx.updatedAt,
        };
    }

    async update(ctx, id, data) {
        const patch = { ...data };
        if (patch.date) patch.date = new Date(patch.date);

        const tx = await TransactionModel.findOneAndUpdate(
            { _id: id, userId: new mongoose.Types.ObjectId(ctx.userId) },
            patch,
            { new: true }
        ).lean();

        if (!tx) throw new NotFoundException('Transaction not found');

        return {
            id: tx._id.toString(),
            userId: tx.userId.toString(),
            type: tx.type,
            amount: tx.amount,
            category: tx.category,
            date: tx.date,
            note: tx.note,
            createdAt: tx.createdAt,
            updatedAt: tx.updatedAt,
        };
    }

    async delete(ctx, id) {
        const isAdmin = (ctx.roles || []).includes(Role.ADMIN);

        if (isAdmin) {
            const deleted = await TransactionModel.findByIdAndDelete(id).lean();
            if (!deleted) throw new NotFoundException('Transaction not found');
            return;
        }

        const deleted = await TransactionModel.findOneAndDelete({
            _id: id,
            userId: new mongoose.Types.ObjectId(ctx.userId),
        }).lean();

        if (!deleted) {
            // если транзакция существует, но не твоя — 403
            const exists = await TransactionModel.exists({ _id: id });
            if (exists) throw new ForbiddenOperationError('Forbidden');
            throw new NotFoundException('Transaction not found');
        }
    }
}
