import { z } from 'zod'

export const allotmentSchema = z.object({
  name: z.string().min(2).max(32),
  assigned_shares: z.number().int().min(0),
  icon: z.string().url().or(z.string().min(2).max(255)),
  total_price: z.number().int().min(0).optional(),
})

const staffSchema = z.object({
  id: z.string().uuid(),
  commission_rate: z.number().int().min(0).max(100),
})

export const projectSchema = z
  .object({
    title: z.string().min(2).max(128),
    commission_rate: z.number().int().min(1).max(100),
    total_shares: z.number().int().gt(0),
    share_price: z.number().int().min(1).max(999999),

    location: z.string().min(2).max(255).nullable().optional(),
    description: z.string().min(10).max(1024).nullable().optional(),

    remaining_shares: z.number().int().min(0).optional(),

    gallery: z.array(z.string().min(2).max(255)).optional(),

    allotments: z.array(allotmentSchema).optional(),

    staffs: z.array(staffSchema).optional(),
  })
  .refine(
    (data) => {
      if (data.remaining_shares !== undefined) {
        return data.remaining_shares <= data.total_shares
      }
      return true
    },
    {
      message: 'Remaining shares cannot exceed total shares',
      path: ['remaining_shares'],
    },
  )

export type TCreateProject = z.infer<typeof projectSchema>
export type TAllotment = z.infer<typeof allotmentSchema>

/**
//NOTE: IMPORTANT RULES:
1. Only title, commission_rate, total_shares, and share_price are REQUIRED
2. If remaining_shares is not provided, system automatically sets it equal to total_shares
3. If remaining_shares is provided and exceeds total_shares, system caps it to total_shares
4. gallery defaults to empty array [] if not provided
5. allotments defaults to empty array [] if not provided
6. agents defaults to empty array [] if not provided
7. location and description can be null if not provided
8. All array items in gallery must be 2-255 characters each
9. Each allotment must have all three required fields: name, assigned_shares, and icon
10. total_price in allotments is OPTIONAL - if not provided, it's auto-calculated as (assigned_shares × share_price)
11. If total_price is provided in allotments, that value will be used (no calculation)
12. All agent IDs must be valid UUIDs (version 4 format)
13. commission_rate represents percentage (e.g., 5 means 5%)
14. share_price maximum is 999999 (6 digits)
 */
