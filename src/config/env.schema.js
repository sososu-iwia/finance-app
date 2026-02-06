import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.string().transform(Number),
  JWT_SECRET: z.string().min(20),
  LOG_LEVEL: z.string().default('info'),
  DATABASE_URL: z.string(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).optional().default('587'),
  SMTP_SECURE: z
    .union([z.literal('true'), z.literal('false')])
    .transform((v) => v === 'true')
    .optional()
    .default('false'),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
});
