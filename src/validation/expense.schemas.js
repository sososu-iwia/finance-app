import { z } from 'zod';

export const createExpenseSchema = z.object({
  amount: z.number().positive('Amount must be greater than 0'),
  category: z.string().min(1, 'Category is required').max(50, 'Category must not exceed 50 characters'),
  date: z.string().refine(
    (val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    },
    { message: 'Invalid date format' }
  ).optional(),
  note: z.string().max(200, 'Note must not exceed 200 characters').optional().default(''),
});

export const updateExpenseSchema = z.object({
  amount: z.number().positive('Amount must be greater than 0').optional(),
  category: z.string().min(1).max(50).optional(),
  date: z.string().refine(
    (val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    },
    { message: 'Invalid date format' }
  ).optional(),
  note: z.string().max(200).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

export const queryExpenseSchema = z.object({
  category: z.string().optional(),
  from: z.string().refine(
    (val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    },
    { message: 'Invalid "from" date format' }
  ).optional(),
  to: z.string().refine(
    (val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    },
    { message: 'Invalid "to" date format' }
  ).optional(),
});
