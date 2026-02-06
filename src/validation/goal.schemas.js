import { z } from 'zod';

export const createGoalSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must not exceed 100 characters'),
  targetAmount: z.number().positive('Target amount must be greater than 0'),
  currentAmount: z.number().min(0).optional().default(0),
  currency: z.string().max(3).optional().default('USD'),
  deadline: z.string().refine(
    (val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    },
    { message: 'Invalid deadline format' }
  ),
  description: z.string().max(500).optional().default(''),
});

export const updateGoalSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  targetAmount: z.number().positive().optional(),
  deadline: z.string().refine(
    (val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    },
    { message: 'Invalid deadline format' }
  ).optional(),
  description: z.string().max(500).optional(),
  status: z.enum(['active', 'completed', 'cancelled']).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

export const queryGoalSchema = z.object({
  status: z.enum(['active', 'completed', 'cancelled']).optional(),
});
