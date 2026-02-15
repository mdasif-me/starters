'use client';

import { Button, Input } from '@/shared/ui';
import { useState } from 'react';
import type { CheckoutFormErrors, PaymentMethod } from '../types/types';

interface PaymentFormProps {
  payment: Partial<PaymentMethod>;
  errors?: CheckoutFormErrors['paymentMethod'];
  onChange: (payment: Partial<PaymentMethod>) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export function PaymentForm({
  payment,
  errors,
  onChange,
  onSubmit,
  onBack,
}: PaymentFormProps) {
  const [paymentType, setPaymentType] = useState<PaymentMethod['type']>(
    payment.type || 'credit_card'
  );

  const handleTypeChange = (type: PaymentMethod['type']) => {
    setPaymentType(type);
    onChange({ ...payment, type });
  };

  const handleChange = (field: keyof PaymentMethod, value: string) => {
    onChange({ ...payment, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Payment Type Selection */}
      <div>
        <label className='block text-sm font-medium mb-3'>
          Payment Method *
        </label>
        <div className='grid grid-cols-3 gap-3'>
          <button
            type='button'
            onClick={() => handleTypeChange('credit_card')}
            className={`p-4 border rounded-md text-sm font-medium transition ${
              paymentType === 'credit_card'
                ? 'border-primary bg-primary/5'
                : 'border-border'
            }`}
          >
            Credit Card
          </button>
          <button
            type='button'
            onClick={() => handleTypeChange('debit_card')}
            className={`p-4 border rounded-md text-sm font-medium transition ${
              paymentType === 'debit_card'
                ? 'border-primary bg-primary/5'
                : 'border-border'
            }`}
          >
            Debit Card
          </button>
          <button
            type='button'
            onClick={() => handleTypeChange('paypal')}
            className={`p-4 border rounded-md text-sm font-medium transition ${
              paymentType === 'paypal'
                ? 'border-primary bg-primary/5'
                : 'border-border'
            }`}
          >
            PayPal
          </button>
        </div>
      </div>

      {/* Card Payment Fields */}
      {(paymentType === 'credit_card' || paymentType === 'debit_card') && (
        <>
          <div>
            <label
              htmlFor='cardNumber'
              className='block text-sm font-medium mb-1'
            >
              Card Number *
            </label>
            <Input
              id='cardNumber'
              value={payment.cardNumber || ''}
              onChange={(e) => handleChange('cardNumber', e.target.value)}
              placeholder='1234 5678 9012 3456'
              aria-invalid={!!errors?.cardNumber}
            />
            {errors?.cardNumber && (
              <p className='text-sm text-destructive mt-1'>
                {errors.cardNumber}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor='cardholderName'
              className='block text-sm font-medium mb-1'
            >
              Cardholder Name *
            </label>
            <Input
              id='cardholderName'
              value={payment.cardholderName || ''}
              onChange={(e) => handleChange('cardholderName', e.target.value)}
              aria-invalid={!!errors?.cardholderName}
            />
            {errors?.cardholderName && (
              <p className='text-sm text-destructive mt-1'>
                {errors.cardholderName}
              </p>
            )}
          </div>

          <div className='grid grid-cols-3 gap-4'>
            <div>
              <label
                htmlFor='expiryMonth'
                className='block text-sm font-medium mb-1'
              >
                Month *
              </label>
              <Input
                id='expiryMonth'
                value={payment.expiryMonth || ''}
                onChange={(e) => handleChange('expiryMonth', e.target.value)}
                placeholder='MM'
                maxLength={2}
                aria-invalid={!!errors?.expiryMonth}
              />
              {errors?.expiryMonth && (
                <p className='text-sm text-destructive mt-1'>
                  {errors.expiryMonth}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor='expiryYear'
                className='block text-sm font-medium mb-1'
              >
                Year *
              </label>
              <Input
                id='expiryYear'
                value={payment.expiryYear || ''}
                onChange={(e) => handleChange('expiryYear', e.target.value)}
                placeholder='YY'
                maxLength={2}
                aria-invalid={!!errors?.expiryYear}
              />
              {errors?.expiryYear && (
                <p className='text-sm text-destructive mt-1'>
                  {errors.expiryYear}
                </p>
              )}
            </div>

            <div>
              <label htmlFor='cvv' className='block text-sm font-medium mb-1'>
                CVV *
              </label>
              <Input
                id='cvv'
                value={payment.cvv || ''}
                onChange={(e) => handleChange('cvv', e.target.value)}
                placeholder='123'
                maxLength={4}
                aria-invalid={!!errors?.cvv}
              />
              {errors?.cvv && (
                <p className='text-sm text-destructive mt-1'>{errors.cvv}</p>
              )}
            </div>
          </div>
        </>
      )}

      {/* PayPal Payment Fields */}
      {paymentType === 'paypal' && (
        <div>
          <label
            htmlFor='paypalEmail'
            className='block text-sm font-medium mb-1'
          >
            PayPal Email *
          </label>
          <Input
            id='paypalEmail'
            type='email'
            value={payment.paypalEmail || ''}
            onChange={(e) => handleChange('paypalEmail', e.target.value)}
            aria-invalid={!!errors?.paypalEmail}
          />
          {errors?.paypalEmail && (
            <p className='text-sm text-destructive mt-1'>
              {errors.paypalEmail}
            </p>
          )}
        </div>
      )}

      <div className='flex gap-3'>
        <Button
          type='button'
          variant='outline'
          size='lg'
          onClick={onBack}
          className='flex-1'
        >
          Back
        </Button>
        <Button type='submit' size='lg' className='flex-1'>
          Review Order
        </Button>
      </div>
    </form>
  );
}
