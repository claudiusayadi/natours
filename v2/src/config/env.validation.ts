import 'dotenv/config';
import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test', 'staging'])
    .default('development'),
  PORT: z.coerce.number().default(4020),
  API_PREFIX: z.string().min(1, 'API_PREFIX is required!'),

  // DB_TYPE: z.string().min(1, 'DB_TYPE is required!'),
  // DB_USERNAME: z.string().min(1, 'DB_USERNAME is required!'),
  // DB_PASSWORD: z.string().min(1, 'DB_PASSWORD is required!'),
  // DB_HOST: z.string().min(1, 'DB_HOST is required!'),
  // DB_PORT: z.coerce.number().min(1, 'DB_PORT is required!'),
  // DB_NAME: z.string().min(1, 'DB_NAME is required!'),

  DB_URL: z.url().min(1, 'DB_URL is required!'),

  JWT_SECRET: z.string(),
  JWT_TTL: z.coerce.number().min(1, 'JWT_TTL is required!'),
  JWT_COOKIES_TTL: z.coerce.number().min(1, 'JWT_COOKIES_TTL is required!'),

  EMAIL_HOST: z.string().optional(),
  EMAIL_PORT: z.coerce.number().optional(),
  EMAIL_USERNAME: z.string().optional(),
  EMAIL_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  EMAIL_SENDER: z.string().optional(),

  SMTP_SERVER: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_LOGIN: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),

  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_KEY: z.string().optional(),
});

export type ApiConfig = z.infer<typeof envSchema>;

export const validateEnv = (): ApiConfig => {
  return envSchema.parse(process.env);
};

export const ApiConfig = validateEnv();
