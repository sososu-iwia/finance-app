import { z } from 'zod';

export const walletAmountSchema = z.object({
    amount: z.number().positive('Amount must be positive'),
});
