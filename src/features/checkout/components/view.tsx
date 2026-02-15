'use client';

import { useCart } from '@/features/cart';
import { formatCurrency } from '@/shared/lib';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';
import { useCheckout } from '../hooks/useCheckout';
import { PaymentForm } from './form-payment';
import { ShippingForm } from './form-shipping';

export function CheckoutView() {
  const { items, subtotal, tax, shipping, total } = useCart();
  const {
    step,
    isLoading,
    errors,
    shippingAddress,
    paymentMethod,
    setShippingAddress,
    setPaymentMethod,
    nextStep,
    prevStep,
    submitOrder,
  } = useCheckout();

  if (items.length === 0) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <Card>
          <CardContent padding='lg'>
            <div className='text-center py-12'>
              <h2 className='text-2xl font-semibold mb-4'>No items in cart</h2>
              <p className='text-muted-foreground mb-6'>
                Add items to your cart before checking out.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-8'>Checkout</h1>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Checkout Forms */}
        <div className='lg:col-span-2'>
          {/* Progress Steps */}
          <div className='flex items-center justify-between mb-8'>
            <div className='flex items-center'>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'shipping'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                1
              </div>
              <span className='ml-2 text-sm font-medium'>Shipping</span>
            </div>
            <div className='flex-1 h-px bg-border mx-4' />
            <div className='flex items-center'>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'payment' || step === 'review'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                2
              </div>
              <span className='ml-2 text-sm font-medium'>Payment</span>
            </div>
            <div className='flex-1 h-px bg-border mx-4' />
            <div className='flex items-center'>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === 'review'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                3
              </div>
              <span className='ml-2 text-sm font-medium'>Review</span>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {step === 'shipping' && 'Shipping Address'}
                {step === 'payment' && 'Payment Information'}
                {step === 'review' && 'Review Order'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {step === 'shipping' && (
                <ShippingForm
                  address={shippingAddress}
                  errors={errors.shippingAddress}
                  onChange={setShippingAddress}
                  onSubmit={nextStep}
                />
              )}

              {step === 'payment' && (
                <PaymentForm
                  payment={paymentMethod}
                  errors={errors.paymentMethod}
                  onChange={setPaymentMethod}
                  onSubmit={nextStep}
                  onBack={prevStep}
                />
              )}

              {step === 'review' && (
                <div className='space-y-6'>
                  <div>
                    <h3 className='font-semibold mb-2'>Shipping Address</h3>
                    <div className='text-sm text-muted-foreground'>
                      <p>{shippingAddress.fullName}</p>
                      <p>{shippingAddress.addressLine1}</p>
                      {shippingAddress.addressLine2 && (
                        <p>{shippingAddress.addressLine2}</p>
                      )}
                      <p>
                        {shippingAddress.city}, {shippingAddress.state}{' '}
                        {shippingAddress.zipCode}
                      </p>
                      <p>{shippingAddress.country}</p>
                      <p>{shippingAddress.phone}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className='font-semibold mb-2'>Payment Method</h3>
                    <p className='text-sm text-muted-foreground'>
                      {paymentMethod.type === 'credit_card' && 'Credit Card'}
                      {paymentMethod.type === 'debit_card' && 'Debit Card'}
                      {paymentMethod.type === 'paypal' && 'PayPal'}
                    </p>
                  </div>

                  {errors.general && (
                    <div className='p-4 bg-destructive/10 border border-destructive rounded-md'>
                      <p className='text-sm text-destructive'>
                        {errors.general}
                      </p>
                    </div>
                  )}

                  <div className='flex gap-3'>
                    <Button
                      type='button'
                      variant='outline'
                      size='lg'
                      onClick={prevStep}
                      className='flex-1'
                    >
                      Back
                    </Button>
                    <Button
                      type='button'
                      size='lg'
                      onClick={submitOrder}
                      disabled={isLoading}
                      className='flex-1'
                    >
                      {isLoading ? 'Processing...' : 'Place Order'}
                    </Button>
                  </div>
                </div>
              )}
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
                  <span className='text-muted-foreground'>
                    Items ({items.length})
                  </span>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
