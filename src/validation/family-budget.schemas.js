import { z } from 'zod';

export const createFamilyBudgetSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must not exceed 100 characters'),
  type: z.enum(['personal', 'family']).optional().default('family'),
  description: z.string().max(500).optional().default(''),
});

export const updateFamilyBudgetSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

export const addMemberSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
});
