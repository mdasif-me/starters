export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface PaymentMethod {
  type: 'credit_card' | 'debit_card' | 'paypal';
  cardNumber?: string;
  cardholderName?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  paypalEmail?: string;
}

export interface CheckoutData {
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  billingAddressSameAsShipping: boolean;
  billingAddress?: ShippingAddress;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: Array<{
    id: string;
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: ShippingAddress;
  createdAt: string;
}

export interface CheckoutFormErrors {
  shippingAddress?: Partial<Record<keyof ShippingAddress, string>>;
  paymentMethod?: Partial<Record<keyof PaymentMethod, string>>;
  general?: string;
}
