import { z } from 'zod'
import { EBuisnessType } from './types'

export const businessInfoSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Company name must be at least 2 characters long')
      .max(128, 'Company name must be at most 128 characters long'),

    type: z.nativeEnum(EBuisnessType),
    registration_number: z
      .string()
      .trim()
      .length(14, 'Registration number must be exactly 14 characters long')
      .regex(/^[a-zA-Z0-9]+$/, 'Must be alphanumeric (no spaces or symbols)')
      .optional(),

    tin: z
      .string()
      .trim()
      .length(12, 'TIN must be exactly 12 digits long')
      .regex(/^\d+$/, 'TIN must contain only digits'),

    trade_license_number: z
      .string()
      .trim()
      .length(12, 'Trade License Number must be exactly 12 digits long')
      .regex(/^\d+$/, 'Trade License Number must contain only digits'),

    vat_number: z
      .string()
      .trim()
      .length(9, 'VAT Registration Number must be exactly 9 digits long')
      .regex(/^\d+$/, 'VAT Registration Number must contain only digits'),
  })
  .superRefine((data, ctx) => {
    if (
      data.type !== EBuisnessType.SOLE_PROPRIETORSHIP &&
      !data.registration_number
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['registration_number'],
        message: 'Registration number is required for limited/public companies',
      })
    }
  })

export const organizationDetailsSchema = z.object({
  date_of_incorporation: z.date('Invalid date format'),
  registered_address: z
    .string()
    .trim()
    .min(2, 'Registered Address must be at least 2 characters long')
    .max(255, 'Registered Address must be at most 255 characters long'),
  mailing_address: z
    .string()
    .trim()
    .min(2, 'Mailing Address must be at least 2 characters long')
    .max(255, 'Mailing Address must be at most 255 characters long'),
  email_address: z
    .string()
    .trim()
    .email('Invalid email address format')
    .max(128, 'Email address must be at most 128 characters long'),
  website: z
    .string()
    .trim()
    .url('Invalid website URL format')
    .max(255, 'Website URL must be at most 255 characters long')
    .optional(),
})

export const infoSchema = z
  .object({})
  .merge(businessInfoSchema)
  .merge(organizationDetailsSchema)

export type businessInfo = z.infer<typeof businessInfoSchema>
export type organizationDetails = z.infer<typeof organizationDetailsSchema>
export type companyInfo = z.infer<typeof infoSchema>
