import mongoose from 'mongoose';
import { TransactionModel } from '../models/transaction.model.js';
import { NotFoundException } from '../errors/http.exceptions.js';

export class ExpenseService {
  async create(ctx, data) {
    const expense = await TransactionModel.create({
      userId: new mongoose.Types.ObjectId(ctx.userId),
      type: 'expense',
      amount: data.amount,
      category: data.category,
      date: new Date(data.date || Date.now()),
      note: data.note || '',
    });

    return {
      id: expense._id.toString(),
      userId: expense.userId.toString(),
      type: expense.type,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      note: expense.note,
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
    };
  }

  async findAll(ctx, filters = {}) {
    const query = {
      userId: new mongoose.Types.ObjectId(ctx.userId),
      type: 'expense',
    };

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
      amount: t.amount,
      category: t.category,
      date: t.date,
      note: t.note,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));
  }

  async findById(ctx, id) {
    const expense = await TransactionModel.findOne({
      _id: id,
      userId: new mongoose.Types.ObjectId(ctx.userId),
      type: 'expense',
    }).lean();

    if (!expense) throw new NotFoundException('Expense not found');

    return {
      id: expense._id.toString(),
      userId: expense.userId.toString(),
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      note: expense.note,
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
    };
  }

  async update(ctx, id, data) {
    const patch = { ...data };
    if (patch.date) patch.date = new Date(patch.date);

    const expense = await TransactionModel.findOneAndUpdate(
      { _id: id, userId: new mongoose.Types.ObjectId(ctx.userId), type: 'expense' },
      patch,
      { new: true }
    ).lean();

    if (!expense) throw new NotFoundException('Expense not found');

    return {
      id: expense._id.toString(),
      userId: expense.userId.toString(),
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      note: expense.note,
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
    };
  }

  async delete(ctx, id) {
    const deleted = await TransactionModel.findOneAndDelete({
      _id: id,
      userId: new mongoose.Types.ObjectId(ctx.userId),
      type: 'expense',
    }).lean();

    if (!deleted) throw new NotFoundException('Expense not found');
  }
}
