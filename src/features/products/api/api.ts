import { apiGet } from '@/shared/api/api-client';
import type { Product, ProductFilters, ProductsResponse } from '../types/types';

/**
 * Fetch list of products with optional filters
 */
export async function fetchProducts(
  filters?: ProductFilters,
  page: number = 1,
  pageSize: number = 20
): Promise<ProductsResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...(filters?.category && { category: filters.category }),
    ...(filters?.minPrice && { minPrice: filters.minPrice.toString() }),
    ...(filters?.maxPrice && { maxPrice: filters.maxPrice.toString() }),
    ...(filters?.inStock !== undefined && {
      inStock: filters.inStock.toString(),
    }),
    ...(filters?.search && { search: filters.search }),
  });

  return apiGet<ProductsResponse>(`/api/products?${params.toString()}`);
}

/**
 * Fetch single product by ID
 */
export async function fetchProduct(id: string): Promise<Product> {
  return apiGet<Product>(`/api/products/${id}`);
}

/**
 * Fetch featured products
 */
export async function fetchFeaturedProducts(): Promise<Product[]> {
  return apiGet<Product[]>('/api/products/featured');
}
