import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.string().transform(Number),
  JWT_SECRET: z.string().min(20),
  LOG_LEVEL: z.string().default('info'),
  DATABASE_URL: z.string(),
});
