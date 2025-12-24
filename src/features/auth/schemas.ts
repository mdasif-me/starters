import { isValidPhoneNumber } from 'react-phone-number-input'
import { z } from 'zod'
import { EScope } from './types'

export const loginSchema = z.object({
  phone_number: z
    .string()
    .refine(isValidPhoneNumber, {
      message: 'Please enter a valid phone number.',
    })
    .nonempty('Phone number is required'),
  scope: z
    .enum([EScope.LOGIN, EScope.REGISTER])
    .default(EScope.LOGIN)
    .optional(),
})

export type LoginCredentials = z.infer<typeof loginSchema>

export const signupSchema = z.object({
  phone_number: z
    .string()
    .refine(isValidPhoneNumber, {
      message: 'Please enter a valid phone number.',
    })
    .nonempty('Phone number is required'),
  scope: z
    .enum([EScope.LOGIN, EScope.REGISTER, EScope.VERIFY])
    .default(EScope.REGISTER)
    .optional(),
})

export type SignupCredentials = z.infer<typeof signupSchema>

export const authVerifySchema = z.object({
  phone_number: z
    .string()
    .refine(isValidPhoneNumber, {
      message: 'Please enter a valid phone number.',
    })
    .optional(),
  scope: z
    .enum([EScope.LOGIN, EScope.REGISTER, EScope.VERIFY])
    .default(EScope.VERIFY)
    .optional(),
  otp: z.string().nonempty('OTP is required'),
})

export type AuthVerifyCredentials = z.infer<typeof authVerifySchema>
