'use client';

import { Button } from '@/shared/ui';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from './card';

export function ProductsView() {
  const { products, isLoading, error, page, total, nextPage, prevPage } =
    useProducts();

  const totalPages = Math.ceil(total / 20);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center py-12'>
          <h2 className='text-2xl font-semibold mb-4 text-destructive'>
            Error
          </h2>
          <p className='text-muted-foreground'>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold mb-2'>Products</h1>
        <p className='text-muted-foreground'>
          Showing {products.length} of {total} products
        </p>
      </div>

      {isLoading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className='h-96 bg-muted animate-pulse rounded-lg'
              aria-hidden='true'
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className='text-center py-12'>
          <h2 className='text-2xl font-semibold mb-4'>No products found</h2>
          <p className='text-muted-foreground'>Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='mt-8 flex items-center justify-center gap-4'>
              <Button
                variant='outline'
                onClick={prevPage}
                disabled={!hasPrevPage || isLoading}
              >
                Previous
              </Button>
              <span className='text-sm text-muted-foreground'>
                Page {page} of {totalPages}
              </span>
              <Button
                variant='outline'
                onClick={nextPage}
                disabled={!hasNextPage || isLoading}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
