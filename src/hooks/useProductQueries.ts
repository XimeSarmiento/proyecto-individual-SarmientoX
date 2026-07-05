import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import {
  getProduct,
  getProductsByBrand,
  getProductsByCategory,
  getProductsByTaste,
  getRandomProducts,
  searchProducts,
  type ProductPage,
} from '@/src/services/openFoodFacts';

const STALE_TIME = 5 * 60 * 1000;

export const productKeys = {
  all: ['products'] as const,
  detail: (id: string) => [...productKeys.all, 'detail', id] as const,
  search: (query: string) => [...productKeys.all, 'search', query] as const,
  category: (id: string, query: string) => [...productKeys.all, 'category', id, query] as const,
  brand: (id: string, query: string) => [...productKeys.all, 'brand', id, query] as const,
  taste: (id: string, query: string) => [...productKeys.all, 'taste', id, query] as const,
};

export function productQueryOptions(id: string) {
  return {
    queryKey: productKeys.detail(id),
    queryFn: ({ signal }: { signal: AbortSignal }) => getProduct(id, signal),
    staleTime: STALE_TIME,
  };
}

export function useProduct(id: string) {
  return useQuery({ ...productQueryOptions(id), enabled: Boolean(id) });
}

export function useSearchProducts(query: string, enabled = true) {
  return useProductsInfiniteQuery(
    productKeys.search(query),
    ({ pageParam, signal }) => query
      ? searchProducts(query, pageParam, signal)
      : getRandomProducts(pageParam, signal),
    enabled,
  );
}

export function useProductsByCategory(id: string, query: string) {
  return useProductsInfiniteQuery(
    productKeys.category(id, query),
    ({ pageParam, signal }) => getProductsByCategory(id, pageParam, signal, query),
    Boolean(id),
  );
}

export function useProductsByBrand(id: string, query: string) {
  return useProductsInfiniteQuery(
    productKeys.brand(id, query),
    ({ pageParam, signal }) => getProductsByBrand(id, pageParam, signal, query),
    Boolean(id),
  );
}

export function useProductsByTaste(id: string, query: string) {
  return useProductsInfiniteQuery(
    productKeys.taste(id, query),
    ({ pageParam, signal }) => getProductsByTaste(id, pageParam, signal, query),
    Boolean(id),
  );
}

function useProductsInfiniteQuery(
  queryKey: readonly unknown[],
  queryFn: (context: { pageParam: number; signal: AbortSignal }) => Promise<ProductPage>,
  enabled: boolean,
) {
  const query = useInfiniteQuery({
    queryKey,
    queryFn,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.page + 1 : undefined,
    enabled,
    staleTime: STALE_TIME,
  });

  const products = query.data?.pages.flatMap((page) => page.products) ?? [];

  return { ...query, products };
}
