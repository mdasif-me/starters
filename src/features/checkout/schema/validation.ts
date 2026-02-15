import { formatNestedZodErrors, formatZodErrors } from '@/shared/lib';
import { z } from 'zod';

/**
 * Shipping address validation schema
 */
export const ShippingAddressSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z
    .string()
    .min(1, 'ZIP code is required')
    .regex(
      /^\d{5}(-\d{4})?$/,
      'Invalid ZIP code format (format: 12345 or 12345-6789)'
    ),
  country: z.string().min(1, 'Country is required'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(
      /^\+?[\d\s()-]{10,}$/,
      'Invalid phone number format (minimum 10 digits)'
    ),
});

export type ShippingAddressInput = z.infer<typeof ShippingAddressSchema>;

/**
 * Credit/Debit card payment schema
 */
const CardPaymentSchema = z.object({
  type: z.enum(['credit_card', 'debit_card']),
  cardNumber: z
    .string()
    .min(1, 'Card number is required')
    .regex(/^\d{13,19}$/, 'Invalid card number (13-19 digits)'),
  cardholderName: z.string().min(1, 'Cardholder name is required'),
  expiryMonth: z
    .string()
    .min(1, 'Expiry month is required')
    .regex(/^(0[1-9]|1[0-2])$/, 'Invalid month (use 01-12)'),
  expiryYear: z
    .string()
    .min(1, 'Expiry year is required')
    .regex(/^\d{2}$/, 'Invalid year format (use YY)'),
  cvv: z
    .string()
    .min(1, 'CVV is required')
    .regex(/^\d{3,4}$/, 'Invalid CVV (3-4 digits)'),
  paypalEmail: z.string().optional(),
});

/**
 * PayPal payment schema
 */
const PayPalPaymentSchema = z.object({
  type: z.literal('paypal'),
  paypalEmail: z
    .string()
    .min(1, 'PayPal email is required')
    .email('Invalid email format'),
  cardNumber: z.string().optional(),
  cardholderName: z.string().optional(),
  expiryMonth: z.string().optional(),
  expiryYear: z.string().optional(),
  cvv: z.string().optional(),
});

/**
 * Payment method schema with discriminated union supporting:
 * - Credit card
 * - Debit card
 * - PayPal
 */
export const PaymentMethodSchema = z.discriminatedUnion('type', [
  CardPaymentSchema,
  PayPalPaymentSchema,
]);

export type PaymentMethodInput = z.infer<typeof PaymentMethodSchema>;

/**
 * Complete checkout form schema with shipping, payment, and optional billing
 */
export const CheckoutFormSchema = z.object({
  shippingAddress: ShippingAddressSchema,
  paymentMethod: PaymentMethodSchema,
  billingAddress: ShippingAddressSchema.optional(),
});

export type CheckoutFormInput = z.infer<typeof CheckoutFormSchema>;

/**
 * Validate shipping address with Zod
 */
export function validateShippingAddress(
  address: unknown
): Record<string, string> {
  const result = ShippingAddressSchema.safeParse(address);

  if (!result.success) {
    return formatZodErrors(result.error);
  }

  return {};
}

/**
 * Validate payment method with Zod
 */
export function validatePaymentMethod(
  payment: unknown
): Record<string, string> {
  const result = PaymentMethodSchema.safeParse(payment);

  if (!result.success) {
    return formatZodErrors(result.error);
  }

  return {};
}

/**
 * Validate entire checkout form with Zod
 */
export function validateCheckoutForm(
  shippingAddress: unknown,
  paymentMethod: unknown,
  billingAddress?: unknown
): {
  shippingAddress?: Record<string, string>;
  paymentMethod?: Record<string, string>;
  general?: string;
} {
  const data = {
    shippingAddress,
    paymentMethod,
    billingAddress,
  };

  const result = CheckoutFormSchema.safeParse(data);

  if (!result.success) {
    return formatNestedZodErrors(result.error) as any;
  }

  return {};
}
