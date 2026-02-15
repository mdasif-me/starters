import { z } from 'zod';
import { VALIDATION } from './constants/appConstants';

export const EmailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email format');

export const PasswordSchema = z
  .string()
  .min(
    VALIDATION.MIN_PASSWORD_LENGTH,
    `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`
  )
  .max(
    VALIDATION.MAX_PASSWORD_LENGTH,
    `Password must be less than ${VALIDATION.MAX_PASSWORD_LENGTH} characters`
  );

export const NameSchema = z
  .string()
  .min(
    VALIDATION.MIN_USERNAME_LENGTH,
    `Name must be at least ${VALIDATION.MIN_USERNAME_LENGTH} characters`
  )
  .max(
    VALIDATION.MAX_USERNAME_LENGTH,
    `Name must be less than ${VALIDATION.MAX_USERNAME_LENGTH} characters`
  )
  .min(1, 'Name is required');

/**
 * Convert Zod error to flat error map
 * @param error Zod validation error
 * @returns Record of field names to error messages
 * @example
 * const result = LoginSchema.safeParse(data);
 * if (!result.success) {
 *   const errors = formatZodErrors(result.error);
 *   // { email: "Invalid email format", password: "Password is required" }
 * }
 */
export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};

  error.issues.forEach((issue) => {
    const path = issue.path[0];
    if (path) {
      errors[String(path)] = issue.message;
    }
  });

  return errors;
}

/**
 * Convert nested Zod errors to nested error map
 * Useful for forms with nested objects like checkout forms
 * @param error Zod validation error
 * @returns Record of nested field errors
 * @example
 * const result = CheckoutFormSchema.safeParse(data);
 * if (!result.success) {
 *   const errors = formatNestedZodErrors(result.error);
 *   // {
 *   //   shippingAddress: {
 *   //     fullName: "Full name is required",
 *   //     zipCode: "Invalid ZIP code format"
 *   //   },
 *   //   paymentMethod: "Invalid payment method"
 *   // }
 * }
 */
export function formatNestedZodErrors(
  error: z.ZodError
): Record<string, Record<string, string> | string> {
  const errors: Record<string, Record<string, string> | string> = {};

  error.issues.forEach((issue) => {
    const [firstPath, secondPath] = issue.path as [string, string];

    if (secondPath) {
      if (!errors[firstPath]) {
        errors[firstPath] = {};
      }
      (errors[firstPath] as Record<string, string>)[secondPath] = issue.message;
    } else if (firstPath) {
      errors[firstPath] = issue.message;
    }
  });

  return errors;
}
