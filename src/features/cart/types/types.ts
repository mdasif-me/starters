export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
}

export interface AddToCartParams {
  productId: string;
  quantity?: number;
  variant?: string;
}

export interface UpdateCartItemParams {
  itemId: string;
  quantity: number;
}

export interface RemoveFromCartParams {
  itemId: string;
}
