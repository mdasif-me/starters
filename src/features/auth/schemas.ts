import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginCredentials = z.infer<typeof loginSchema>

export const signupSchema = z.object({
  phone: z.string().nonempty('Phone number is required'),
})

export type SignupCredentials = z.infer<typeof signupSchema>
