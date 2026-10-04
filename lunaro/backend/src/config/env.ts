import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development","test","production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("7d"),
  FRONTEND_URL: z.string().url(),
  ADMIN_URL: z.string().url(),
  COOKIE_DOMAIN: z.string().optional().or(z.literal("")),
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().positive().default(465),
  SMTP_SECURE: z.coerce.boolean().default(true),
  SMTP_USER: z.string().email(),
  SMTP_PASS: z.string().min(1),
  CONTACT_TO: z.string().email(),
  CONTACT_FROM: z.string().min(1),
  PUBLIC_API_URL: z.string().url().default("http://localhost:4000")
});

export const env = schema.parse(process.env);
