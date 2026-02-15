import type { Cart, CartItem } from '../types/types';

/**
 * Calculate cart subtotal (sum of all item prices * quantities)
 */
export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/**
 * Calculate cart tax (simplified: 8% of subtotal)
 */
export function calculateTax(subtotal: number, taxRate: number = 0.08): number {
  return subtotal * taxRate;
}

/**
 * Calculate shipping cost (simplified: free over $50, otherwise $5)
 */
export function calculateShipping(subtotal: number): number {
  return subtotal >= 50 ? 0 : 5;
}

/**
 * Calculate cart totals
 */
export function calculateCartTotals(items: CartItem[]): Omit<Cart, 'items'> {
  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + tax + shipping;

  return { subtotal, tax, shipping, total };
}

/**
 * Get total number of items in cart
 */
export function getCartItemCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0);
}

/**
 * Find cart item by ID
 */
export function findCartItem(
  items: CartItem[],
  itemId: string
): CartItem | undefined {
  return items.find((item) => item.id === itemId);
}

/**
 * Check if product is already in cart
 */
export function isProductInCart(
  items: CartItem[],
  productId: string,
  variant?: string
): boolean {
  return items.some(
    (item) => item.productId === productId && item.variant === variant
  );
}
