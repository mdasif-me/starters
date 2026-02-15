'use client';

import { formatCurrency } from '@/shared/lib';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';
import Link from 'next/link';
import { useCart } from '../hooks/useCart';
import { CartItem } from './item';

export function CartView() {
  const {
    items,
    subtotal,
    tax,
    shipping,
    total,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <Card>
          <CardContent padding='lg'>
            <div className='text-center py-12'>
              <h2 className='text-2xl font-semibold mb-4'>
                Your cart is empty
              </h2>
              <p className='text-muted-foreground mb-6'>
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link href='/products'>
                <Button>Continue Shopping</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Cart Items */}
        <div className='lg:col-span-2'>
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>Shopping Cart ({items.length})</CardTitle>
                <Button variant='ghost' size='sm' onClick={clearCart}>
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div>
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className='lg:col-span-1'>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Subtotal</span>
                  <span className='font-medium'>
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Shipping</span>
                  <span className='font-medium'>
                    {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                  </span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Tax</span>
                  <span className='font-medium'>{formatCurrency(tax)}</span>
                </div>
                <div className='pt-3 border-t border-border'>
                  <div className='flex justify-between'>
                    <span className='font-semibold'>Total</span>
                    <span className='font-semibold text-lg'>
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>

              <Link href='/checkout' className='block mt-6'>
                <Button className='w-full' size='lg'>
                  Proceed to Checkout
                </Button>
              </Link>

              <Link href='/products' className='block mt-3'>
                <Button variant='outline' className='w-full'>
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
