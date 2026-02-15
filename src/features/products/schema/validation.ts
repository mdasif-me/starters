import { z } from 'zod';

/**
 * Products feature schemas
 * Add product-specific validation schemas here as features grow
 */

// Example: Product filter schema
export const ProductFilterSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  inStock: z.boolean().optional(),
});

export type ProductFilterInput = z.infer<typeof ProductFilterSchema>;
