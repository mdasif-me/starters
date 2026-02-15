'use client';

import { useLocalStorage } from '@/shared/hooks';
import { useCallback, useState } from 'react';
import type { AddToCartParams, CartItem } from '../types/types';
import { calculateCartTotals, getCartItemCount } from '../utils/helpers';

export function useCart() {
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cartTotals = calculateCartTotals(cart);
  const itemCount = getCartItemCount(cart);

  /**
   * Add item to cart
   */
  const addItem = useCallback(
    async (
      params: AddToCartParams & { name: string; price: number; image?: string }
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        // Check if item already exists
        const existingItemIndex = cart.findIndex(
          (item) =>
            item.productId === params.productId &&
            item.variant === params.variant
        );

        if (existingItemIndex !== -1) {
          // Update quantity if item exists
          const updatedCart = [...cart];
          updatedCart[existingItemIndex].quantity += params.quantity || 1;
          setCart(updatedCart);
        } else {
          // Add new item
          const newItem: CartItem = {
            id: `${params.productId}-${params.variant || 'default'}-${Date.now()}`,
            productId: params.productId,
            name: params.name,
            price: params.price,
            quantity: params.quantity || 1,
            image: params.image,
            variant: params.variant,
          };
          setCart([...cart, newItem]);
        }

        // Optionally sync with backend
        // await cartApi.addToCart(params);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to add item to cart'
        );
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [cart, setCart]
  );

  /**
   * Update item quantity
   */
  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(itemId);
        return;
      }

      const updatedCart = cart.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );
      setCart(updatedCart);
    },
    [cart, setCart]
  );

  /**
   * Remove item from cart
   */
  const removeItem = useCallback(
    (itemId: string) => {
      const updatedCart = cart.filter((item) => item.id !== itemId);
      setCart(updatedCart);
    },
    [cart, setCart]
  );

  /**
   * Clear cart
   */
  const clearCart = useCallback(() => {
    setCart([]);
  }, [setCart]);

  return {
    items: cart,
    ...cartTotals,
    itemCount,
    isLoading,
    error,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };
}
