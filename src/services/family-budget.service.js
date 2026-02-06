import mongoose from 'mongoose';
import { FamilyBudgetModel } from '../models/family-budget.model.js';
import { NotFoundException, ValidationException, ForbiddenOperationError } from '../errors/http.exceptions.js';

export class FamilyBudgetService {
  async create(ctx, data) {
    const budget = await FamilyBudgetModel.create({
      name: data.name,
      ownerId: new mongoose.Types.ObjectId(ctx.userId),
      type: data.type || 'family',
      description: data.description || '',
      members: [
        {
          userId: new mongoose.Types.ObjectId(ctx.userId),
          role: 'OWNER',
          joinedAt: new Date(),
        },
      ],
    });

    return this._formatBudget(budget);
  }

  async findAll(ctx) {
    const budgets = await FamilyBudgetModel.find({
      $or: [
        { ownerId: new mongoose.Types.ObjectId(ctx.userId) },
        { 'members.userId': new mongoose.Types.ObjectId(ctx.userId) },
      ],
    })
      .populate('ownerId', 'email username')
      .populate('members.userId', 'email username')
      .sort({ createdAt: -1 })
      .lean();

    return budgets.map((b) => this._formatBudget(b));
  }

  async findById(ctx, id) {
    const budget = await FamilyBudgetModel.findOne({
      _id: id,
      $or: [
        { ownerId: new mongoose.Types.ObjectId(ctx.userId) },
        { 'members.userId': new mongoose.Types.ObjectId(ctx.userId) },
      ],
    })
      .populate('ownerId', 'email username')
      .populate('members.userId', 'email username')
      .lean();

    if (!budget) throw new NotFoundException('Budget not found');

    return this._formatBudget(budget);
  }

  async update(ctx, id, data) {
    const budget = await FamilyBudgetModel.findById(id).lean();
    if (!budget) throw new NotFoundException('Budget not found');

    const isOwner = String(budget.ownerId) === String(ctx.userId);
    if (!isOwner) throw new ForbiddenOperationError('Only owner can update budget');

    const patch = {};
    if (data.name) patch.name = data.name;
    if (data.description !== undefined) patch.description = data.description;

    const updated = await FamilyBudgetModel.findByIdAndUpdate(id, patch, { new: true })
      .populate('ownerId', 'email username')
      .populate('members.userId', 'email username')
      .lean();

    return this._formatBudget(updated);
  }

  async delete(ctx, id) {
    const budget = await FamilyBudgetModel.findById(id).lean();
    if (!budget) throw new NotFoundException('Budget not found');

    const isOwner = String(budget.ownerId) === String(ctx.userId);
    if (!isOwner) throw new ForbiddenOperationError('Only owner can delete budget');

    await FamilyBudgetModel.findByIdAndDelete(id);
  }

  async addMember(ctx, budgetId, userId) {
    const budget = await FamilyBudgetModel.findById(budgetId).lean();
    if (!budget) throw new NotFoundException('Budget not found');

    const isOwner = String(budget.ownerId) === String(ctx.userId);
    if (!isOwner) throw new ForbiddenOperationError('Only owner can add members');

    const alreadyMember = budget.members.some((m) => String(m.userId) === String(userId));
    if (alreadyMember) {
      throw new ValidationException('User is already a member');
    }

    const updated = await FamilyBudgetModel.findByIdAndUpdate(
      budgetId,
      {
        $push: {
          members: {
            userId: new mongoose.Types.ObjectId(userId),
            role: 'MEMBER',
            joinedAt: new Date(),
          },
        },
      },
      { new: true }
    )
      .populate('ownerId', 'email username')
      .populate('members.userId', 'email username')
      .lean();

    return this._formatBudget(updated);
  }

  async removeMember(ctx, budgetId, userId) {
    const budget = await FamilyBudgetModel.findById(budgetId).lean();
    if (!budget) throw new NotFoundException('Budget not found');

    const isOwner = String(budget.ownerId) === String(ctx.userId);
    if (!isOwner) throw new ForbiddenOperationError('Only owner can remove members');

    if (String(budget.ownerId) === String(userId)) {
      throw new ValidationException('Cannot remove owner');
    }

    const updated = await FamilyBudgetModel.findByIdAndUpdate(
      budgetId,
      { $pull: { members: { userId: new mongoose.Types.ObjectId(userId) } } },
      { new: true }
    )
      .populate('ownerId', 'email username')
      .populate('members.userId', 'email username')
      .lean();

    return this._formatBudget(updated);
  }

  _formatBudget(budget) {
    return {
      id: budget._id.toString(),
      name: budget.name,
      ownerId: budget.ownerId?._id?.toString() || budget.ownerId?.toString(),
      owner: budget.ownerId?.email || null,
      type: budget.type,
      description: budget.description,
      members: budget.members?.map((m) => ({
        userId: m.userId?._id?.toString() || m.userId?.toString(),
        email: m.userId?.email || null,
        username: m.userId?.username || null,
        role: m.role,
        joinedAt: m.joinedAt,
      })) || [],
      createdAt: budget.createdAt,
      updatedAt: budget.updatedAt,
    };
  }
}
