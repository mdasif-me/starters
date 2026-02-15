import { apiPost } from '@/shared/api/api-client';
import type { CheckoutData, Order } from '../types/types';

/**
 * Submit checkout and create order
 */
export async function submitCheckout(data: CheckoutData): Promise<Order> {
  return apiPost<Order>(
    '/api/checkout',
    data as unknown as Record<string, unknown>
  );
}

/**
 * Validate shipping address
 */
export async function validateAddress(
  address: CheckoutData['shippingAddress']
): Promise<boolean> {
  try {
    const response = await apiPost<{ valid: boolean }>(
      '/api/checkout/validate-address',
      address as unknown as Record<string, unknown>
    );
    return response.valid;
  } catch {
    return false;
  }
}

/**
 * Calculate shipping rates for address
 */
export async function getShippingRates(
  address: CheckoutData['shippingAddress']
): Promise<
  Array<{
    id: string;
    name: string;
    price: number;
    estimatedDays: number;
  }>
> {
  return apiPost(
    '/api/checkout/shipping-rates',
    address as unknown as Record<string, unknown>
  );
}
