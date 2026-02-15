import {
  EmailSchema,
  NameSchema,
  PasswordSchema,
  formatZodErrors,
} from '@/shared/lib/schemas';
import { z } from 'zod';

/**
 * Login form schema
 */
export const LoginSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

export type LoginInput = z.infer<typeof LoginSchema>;

/**
 * Register form schema with password confirmation validation
 */
export const RegisterSchema = z
  .object({
    name: NameSchema,
    email: EmailSchema,
    password: PasswordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof RegisterSchema>;

/**
 * Validate login form with Zod
 */
export function validateLoginForm(
  credentials: unknown
): Record<string, string> {
  const result = LoginSchema.safeParse(credentials);

  if (!result.success) {
    return formatZodErrors(result.error);
  }

  return {};
}

/**
 * Validate register form with Zod
 */
export function validateRegisterForm(
  credentials: unknown
): Record<string, string> {
  const result = RegisterSchema.safeParse(credentials);

  if (!result.success) {
    return formatZodErrors(result.error);
  }

  return {};
}
