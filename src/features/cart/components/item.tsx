'use client';

import { formatCurrency } from '@/shared/lib';
import { Button } from '@/shared/ui';
import Image from 'next/image';
import type { CartItem as CartItemType } from '../types/types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const handleDecrement = () => {
    onUpdateQuantity(item.id, Math.max(0, item.quantity - 1));
  };

  const handleIncrement = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const itemTotal = item.price * item.quantity;

  return (
    <div className='flex gap-4 py-4 border-b border-border'>
      {item.image && (
        <div className='flex-shrink-0 w-24 h-24 bg-muted rounded-md overflow-hidden'>
          <Image
            src={item.image}
            alt={item.name}
            width={96}
            height={96}
            className='w-full h-full object-cover'
          />
        </div>
      )}

      <div className='flex-1 min-w-0'>
        <h3 className='font-medium text-foreground truncate'>{item.name}</h3>
        {item.variant && (
          <p className='text-sm text-muted-foreground mt-1'>{item.variant}</p>
        )}
        <p className='text-sm font-medium text-foreground mt-2'>
          {formatCurrency(item.price)}
        </p>
      </div>

      <div className='flex flex-col items-end gap-2'>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={handleDecrement}
            aria-label='Decrease quantity'
          >
            -
          </Button>
          <span className='w-8 text-center font-medium'>{item.quantity}</span>
          <Button
            variant='outline'
            size='sm'
            onClick={handleIncrement}
            aria-label='Increase quantity'
          >
            +
          </Button>
        </div>
        <p className='font-semibold text-foreground'>
          {formatCurrency(itemTotal)}
        </p>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => onRemove(item.id)}
          className='text-destructive hover:text-destructive'
        >
          Remove
        </Button>
      </div>
    </div>
  );
}
