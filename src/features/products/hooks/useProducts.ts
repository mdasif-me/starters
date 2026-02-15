'use client';

import { useCallback, useEffect, useState } from 'react';
import * as productsApi from '../api/api';
import type { Product, ProductFilters } from '../types/types';

export function useProducts(initialFilters?: ProductFilters) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFilters>(initialFilters || {});
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await productsApi.fetchProducts(filters, page, 20);
      setProducts(response.products);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const updateFilters = useCallback((newFilters: ProductFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to page 1 when filters change
  }, []);

  const nextPage = useCallback(() => {
    if (products.length < total) {
      setPage((prev) => prev + 1);
    }
  }, [products.length, total]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  }, [page]);

  return {
    products,
    isLoading,
    error,
    filters,
    page,
    total,
    updateFilters,
    nextPage,
    prevPage,
    refresh: loadProducts,
  };
}
