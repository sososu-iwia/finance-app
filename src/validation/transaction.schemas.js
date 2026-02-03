import { z } from 'zod';

export const createTransactionSchema = z.object({
    type: z.enum(['income', 'expense'], {
        errorMap: () => ({ message: 'Type must be "income" or "expense"' }),
    }),
    amount: z.number().positive('Amount must be greater than 0'),
    category: z
        .string()
        .min(1, 'Category is required')
        .max(50, 'Category must not exceed 50 characters'),
    date: z.string().refine(
        (val) => {
            const date = new Date(val);
            return !isNaN(date.getTime());
        },
        { message: 'Invalid date format' }
    ),
    note: z
        .string()
        .max(200, 'Note must not exceed 200 characters')
        .optional()
        .default(''),
});

export const updateTransactionSchema = z
    .object({
        type: z.enum(['income', 'expense']).optional(),
        amount: z.number().positive('Amount must be greater than 0').optional(),
        category: z
            .string()
            .min(1, 'Category cannot be empty')
            .max(50, 'Category must not exceed 50 characters')
            .optional(),
        date: z
            .string()
            .refine(
                (val) => {
                    const date = new Date(val);
                    return !isNaN(date.getTime());
                },
                { message: 'Invalid date format' }
            )
            .optional(),
        note: z
            .string()
            .max(200, 'Note must not exceed 200 characters')
            .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field must be provided for update',
    });

export const queryTransactionSchema = z.object({
    type: z.enum(['income', 'expense']).optional(),
    from: z
        .string()
        .refine(
            (val) => {
                const date = new Date(val);
                return !isNaN(date.getTime());
            },
            { message: 'Invalid "from" date format' }
        )
        .optional(),
    to: z
        .string()
        .refine(
            (val) => {
                const date = new Date(val);
                return !isNaN(date.getTime());
            },
            { message: 'Invalid "to" date format' }
        )
        .optional(),
    category: z.string().optional(),
});

export const querySummarySchema = z.object({
    from: z
        .string()
        .refine(
            (val) => {
                const date = new Date(val);
                return !isNaN(date.getTime());
            },
            { message: 'Invalid "from" date format' }
        )
        .optional(),
    to: z
        .string()
        .refine(
            (val) => {
                const date = new Date(val);
                return !isNaN(date.getTime());
            },
            { message: 'Invalid "to" date format' }
        )
        .optional(),
});
