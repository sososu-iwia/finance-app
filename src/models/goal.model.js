import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    targetAmount: { type: Number, required: true, min: 0.01 },
    currentAmount: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: 'USD', maxlength: 3 },
    deadline: { type: Date, required: true },
    description: { type: String, maxlength: 500, default: '' },
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
  },
  { timestamps: true }
);

goalSchema.index({ userId: 1, status: 1 });
goalSchema.index({ deadline: 1 });

export const GoalModel = mongoose.model('Goal', goalSchema);
