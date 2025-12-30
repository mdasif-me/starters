import { z } from 'zod';

export const AuthSchemas = {
  login: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    rememberMe: z.boolean().optional(),
  }),

  register: z
    .object({
      email: z.string().email('Invalid email address'),
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(
          /[^A-Za-z0-9]/,
          'Password must contain at least one special character'
        ),
      confirmPassword: z.string(),
      name: z.string().min(2, 'Name must be at least 2 characters'),
      acceptTerms: z.boolean().refine((val) => val === true, {
        message: 'You must accept the terms and conditions',
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }),

  forgotPassword: z.object({
    email: z.string().email('Invalid email address'),
  }),

  resetPassword: z
    .object({
      token: z.string(),
      newPassword: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }),

  updateProfile: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: z.string().email('Invalid email address').optional(),
    phone: z
      .string()
      .regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number')
      .optional(),
    avatar: z.string().url('Invalid URL').optional(),
  }),

  changePassword: z
    .object({
      currentPassword: z.string().min(6, 'Current password is required'),
      newPassword: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }),
};

export const UserSchemas = {
  createUser: z.object({
    email: z.string().email('Invalid email address'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    role: z.enum(['user', 'manager', 'admin']),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .optional(),
  }),

  updateUser: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: z.string().email('Invalid email address').optional(),
    role: z.enum(['user', 'manager', 'admin']).optional(),
    status: z.enum(['active', 'inactive', 'suspended']).optional(),
  }),
};

export type LoginForm = z.infer<typeof AuthSchemas.login>;
export type RegisterForm = z.infer<typeof AuthSchemas.register>;
export type UpdateProfileForm = z.infer<typeof AuthSchemas.updateProfile>;
