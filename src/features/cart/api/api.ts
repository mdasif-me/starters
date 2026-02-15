import { apiDelete, apiGet, apiPost, apiPut } from '@/shared/api/api-client';
import type {
  AddToCartParams,
  Cart,
  RemoveFromCartParams,
  UpdateCartItemParams,
} from '../types/types';

/**
 * Fetch the current user's cart
 */
export async function fetchCart(): Promise<Cart> {
  return apiGet<Cart>('/api/cart');
}

/**
 * Add item to cart
 */
export async function addToCart(params: AddToCartParams): Promise<Cart> {
  return apiPost<Cart>(
    '/api/cart/items',
    params as unknown as Record<string, unknown>
  );
}

/**
 * Update cart item quantity
 */
export async function updateCartItem(
  params: UpdateCartItemParams
): Promise<Cart> {
  return apiPut<Cart>(`/api/cart/items/${params.itemId}`, {
    quantity: params.quantity,
  });
}

/**
 * Remove item from cart
 */
export async function removeFromCart(
  params: RemoveFromCartParams
): Promise<Cart> {
  return apiDelete<Cart>(`/api/cart/items/${params.itemId}`);
}

/**
 * Clear the entire cart
 */
export async function clearCart(): Promise<void> {
  return apiDelete<void>('/api/cart');
}
