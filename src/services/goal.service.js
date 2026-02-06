import mongoose from 'mongoose';
import { GoalModel } from '../models/goal.model.js';
import { TransactionModel } from '../models/transaction.model.js';
import { NotFoundException, ValidationException } from '../errors/http.exceptions.js';

export class GoalService {
  async create(ctx, data) {
    if (new Date(data.deadline) < new Date()) {
      throw new ValidationException('Deadline cannot be in the past');
    }

    const goal = await GoalModel.create({
      userId: new mongoose.Types.ObjectId(ctx.userId),
      name: data.name,
      targetAmount: data.targetAmount,
      currentAmount: data.currentAmount || 0,
      currency: data.currency || 'USD',
      deadline: new Date(data.deadline),
      description: data.description || '',
      status: 'active',
    });

    return this._formatGoal(goal);
  }

  async findAll(ctx, filters = {}) {
    const query = { userId: new mongoose.Types.ObjectId(ctx.userId) };

    if (filters.status) query.status = filters.status;

    const goals = await GoalModel.find(query).sort({ deadline: 1 }).lean();
    const goalsWithProgress = await Promise.all(
      goals.map(async (goal) => {
        const progress = await this._calculateProgress(goal._id);
        return { ...this._formatGoal(goal), currentAmount: progress };
      })
    );

    return goalsWithProgress;
  }

  async findById(ctx, id) {
    const goal = await GoalModel.findOne({
      _id: id,
      userId: new mongoose.Types.ObjectId(ctx.userId),
    }).lean();

    if (!goal) throw new NotFoundException('Goal not found');

    const progress = await this._calculateProgress(goal._id);
    return { ...this._formatGoal(goal), currentAmount: progress };
  }

  async update(ctx, id, data) {
    const patch = {};
    if (data.name) patch.name = data.name;
    if (data.targetAmount) patch.targetAmount = data.targetAmount;
    if (data.deadline) {
      const deadline = new Date(data.deadline);
      if (deadline < new Date()) {
        throw new ValidationException('Deadline cannot be in the past');
      }
      patch.deadline = deadline;
    }
    if (data.description !== undefined) patch.description = data.description;
    if (data.status) patch.status = data.status;

    const goal = await GoalModel.findOneAndUpdate(
      { _id: id, userId: new mongoose.Types.ObjectId(ctx.userId) },
      patch,
      { new: true }
    ).lean();

    if (!goal) throw new NotFoundException('Goal not found');

    const progress = await this._calculateProgress(goal._id);
    return { ...this._formatGoal(goal), currentAmount: progress };
  }

  async delete(ctx, id) {
    const deleted = await GoalModel.findOneAndDelete({
      _id: id,
      userId: new mongoose.Types.ObjectId(ctx.userId),
    }).lean();

    if (!deleted) throw new NotFoundException('Goal not found');
  }

  async _calculateProgress(goalId) {
    const result = await TransactionModel.aggregate([
      {
        $match: {
          type: 'income',
          note: { $regex: `goal:${goalId}`, $options: 'i' },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    return result[0]?.total || 0;
  }

  _formatGoal(goal) {
    return {
      id: goal._id.toString(),
      userId: goal.userId.toString(),
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      currency: goal.currency,
      deadline: goal.deadline,
      description: goal.description,
      status: goal.status,
      progress: goal.currentAmount / goal.targetAmount,
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt,
    };
  }
}
