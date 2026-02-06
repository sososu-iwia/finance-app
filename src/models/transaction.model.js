import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true, min: 0.01 },
    category: { type: String, required: true, trim: true, maxlength: 50 },
    date: { type: Date, required: true, index: true },
    note: { type: String, default: '', maxlength: 200 },
  },
  { timestamps: true }
);

transactionSchema.index({ userId: 1, date: -1 });

export const TransactionModel = mongoose.model('Transaction', transactionSchema);

