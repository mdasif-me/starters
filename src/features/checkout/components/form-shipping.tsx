'use client';

import { Button, Input } from '@/shared/ui';
import type { CheckoutFormErrors, ShippingAddress } from '../types/types';

interface ShippingFormProps {
  address: Partial<ShippingAddress>;
  errors?: CheckoutFormErrors['shippingAddress'];
  onChange: (address: Partial<ShippingAddress>) => void;
  onSubmit: () => void;
}

export function ShippingForm({
  address,
  errors,
  onChange,
  onSubmit,
}: ShippingFormProps) {
  const handleChange = (field: keyof ShippingAddress, value: string) => {
    onChange({ ...address, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label htmlFor='fullName' className='block text-sm font-medium mb-1'>
          Full Name *
        </label>
        <Input
          id='fullName'
          value={address.fullName || ''}
          onChange={(e) => handleChange('fullName', e.target.value)}
          aria-invalid={!!errors?.fullName}
        />
        {errors?.fullName && (
          <p className='text-sm text-destructive mt-1'>{errors.fullName}</p>
        )}
      </div>

      <div>
        <label
          htmlFor='addressLine1'
          className='block text-sm font-medium mb-1'
        >
          Address Line 1 *
        </label>
        <Input
          id='addressLine1'
          value={address.addressLine1 || ''}
          onChange={(e) => handleChange('addressLine1', e.target.value)}
          aria-invalid={!!errors?.addressLine1}
        />
        {errors?.addressLine1 && (
          <p className='text-sm text-destructive mt-1'>{errors.addressLine1}</p>
        )}
      </div>

      <div>
        <label
          htmlFor='addressLine2'
          className='block text-sm font-medium mb-1'
        >
          Address Line 2 (Optional)
        </label>
        <Input
          id='addressLine2'
          value={address.addressLine2 || ''}
          onChange={(e) => handleChange('addressLine2', e.target.value)}
        />
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label htmlFor='city' className='block text-sm font-medium mb-1'>
            City *
          </label>
          <Input
            id='city'
            value={address.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            aria-invalid={!!errors?.city}
          />
          {errors?.city && (
            <p className='text-sm text-destructive mt-1'>{errors.city}</p>
          )}
        </div>

        <div>
          <label htmlFor='state' className='block text-sm font-medium mb-1'>
            State *
          </label>
          <Input
            id='state'
            value={address.state || ''}
            onChange={(e) => handleChange('state', e.target.value)}
            aria-invalid={!!errors?.state}
          />
          {errors?.state && (
            <p className='text-sm text-destructive mt-1'>{errors.state}</p>
          )}
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label htmlFor='zipCode' className='block text-sm font-medium mb-1'>
            ZIP Code *
          </label>
          <Input
            id='zipCode'
            value={address.zipCode || ''}
            onChange={(e) => handleChange('zipCode', e.target.value)}
            aria-invalid={!!errors?.zipCode}
          />
          {errors?.zipCode && (
            <p className='text-sm text-destructive mt-1'>{errors.zipCode}</p>
          )}
        </div>

        <div>
          <label htmlFor='country' className='block text-sm font-medium mb-1'>
            Country *
          </label>
          <Input
            id='country'
            value={address.country || ''}
            onChange={(e) => handleChange('country', e.target.value)}
            aria-invalid={!!errors?.country}
          />
          {errors?.country && (
            <p className='text-sm text-destructive mt-1'>{errors.country}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor='phone' className='block text-sm font-medium mb-1'>
          Phone Number *
        </label>
        <Input
          id='phone'
          type='tel'
          value={address.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
          aria-invalid={!!errors?.phone}
        />
        {errors?.phone && (
          <p className='text-sm text-destructive mt-1'>{errors.phone}</p>
        )}
      </div>

      <Button type='submit' size='lg' className='w-full'>
        Continue to Payment
      </Button>
    </form>
  );
}
