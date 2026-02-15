'use client';

import { useCart } from '@/features/cart';
import { formatCurrency } from '@/shared/lib';
import { Button, Card, CardContent, CardFooter } from '@/shared/ui';
import Image from 'next/image';
import type { Product } from '../types/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = async () => {
    await addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
  };

  return (
    <Card className='h-full flex flex-col'>
      {product.image && (
        <div className='w-full aspect-square bg-muted overflow-hidden rounded-t-lg'>
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={300}
            className='w-full h-full object-cover'
          />
        </div>
      )}

      <CardContent padding='md' className='flex-1 flex flex-col'>
        {product.category && (
          <span className='text-xs text-muted-foreground uppercase tracking-wide mb-2'>
            {product.category}
          </span>
        )}

        <h3 className='font-semibold text-lg mb-2 line-clamp-2'>
          {product.name}
        </h3>

        <p className='text-sm text-muted-foreground mb-4 line-clamp-2 flex-1'>
          {product.description}
        </p>

        <div className='flex items-center justify-between'>
          <span className='text-lg font-bold'>
            {formatCurrency(product.price)}
          </span>
          {product.rating && (
            <div className='flex items-center gap-1 text-sm'>
              <span className='text-yellow-500'>★</span>
              <span>{product.rating.toFixed(1)}</span>
              {product.reviews && (
                <span className='text-muted-foreground'>
                  ({product.reviews})
                </span>
              )}
            </div>
          )}
        </div>

        {product.stock === 0 && (
          <p className='text-sm text-destructive mt-2'>Out of stock</p>
        )}
      </CardContent>

      <CardFooter>
        <Button
          className='w-full'
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}
