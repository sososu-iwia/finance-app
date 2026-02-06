import mongoose from 'mongoose';

const budgetMemberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['OWNER', 'MEMBER'], required: true },
  joinedAt: { type: Date, default: Date.now },
});

const familyBudgetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['personal', 'family'], default: 'family' },
    members: [budgetMemberSchema],
    description: { type: String, maxlength: 500, default: '' },
  },
  { timestamps: true }
);

familyBudgetSchema.index({ ownerId: 1 });
familyBudgetSchema.index({ 'members.userId': 1 });

export const FamilyBudgetModel = mongoose.model('FamilyBudget', familyBudgetSchema);
