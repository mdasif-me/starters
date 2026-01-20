import { z } from 'zod'

export const updateProfileSchema = z.object({
  photo: z.string().url().nullable().optional(),
  phone_number: z.string().min(7).max(15),
  email_address: z.string().email().nullable().optional(),
})

export const updateCompanyInfoSchema = z.object({
  website: z.string().min(2).max(128),
  mailing_address: z.string().min(2).max(256),
  registered_address: z.string().min(2).max(256),
})

export type TUpdateProfile = z.infer<typeof updateProfileSchema>
export type TUpdateCompanyInfo = z.infer<typeof updateCompanyInfoSchema>
