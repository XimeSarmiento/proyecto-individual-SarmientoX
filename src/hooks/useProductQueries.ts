import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import {
  getProduct,
  getProductsByBrand,
  getProductsByCategory,
  getProductsByTaste,
  getRandomProducts,
  type OpenFoodFactsSearchResponse,
  PRODUCT_PAGE_SIZE,
  searchProducts,
} from '@/src/services/openFoodFacts';
import {
  transformProductPage,
  transformProductResponse,
  type ProductPage,
} from '@/src/transformers/openFoodFacts.transformer';

const STALE_TIME = 5 * 60 * 1000;
export type ProductFilterType = 'categoria' | 'marca' | 'taste';

export const productKeys = {
  all: ['products'] as const,
  detail: (id: string) => [...productKeys.all, 'detail', id] as const,
  search: (query: string) => [...productKeys.all, 'search', query] as const,
  filtered: (type: ProductFilterType, id: string, query: string) =>
    [...productKeys.all, type, id, query] as const,
};

export function productQueryOptions(id: string) {
  return {
    queryKey: productKeys.detail(id),
    queryFn: async ({ signal }: { signal: AbortSignal }) =>
      transformProductResponse(await getProduct(id, signal)),
    staleTime: STALE_TIME,
  };
}

export function useProduct(id: string) {
  return useQuery({ ...productQueryOptions(id), enabled: Boolean(id) });
}

export function useSearchProducts(query: string, enabled = true) {
  return useProductsInfiniteQuery(
    productKeys.search(query),
    async ({ pageParam, signal }) => {
      if (/^\d{8,14}$/.test(query)) {
        const product = transformProductResponse(await getProduct(query, signal));
        return { products: product ? [product] : [], page: 1, hasMore: false };
      }

      const response = query
        ? await searchProducts(query, pageParam, signal)
        : await getRandomProducts(pageParam, signal);
      return transformPage(response, pageParam);
    },
    enabled,
  );
}

export function useFilteredProducts(type: ProductFilterType, id: string, query: string) {
  return useProductsInfiniteQuery(
    productKeys.filtered(type, id, query),
    async ({ pageParam, signal }) => {
      const response = type === 'categoria'
        ? await getProductsByCategory(id, pageParam, signal, query)
        : type === 'marca'
          ? await getProductsByBrand(id, pageParam, signal, query)
          : await getProductsByTaste(id, pageParam, signal, query);
      return transformPage(response, pageParam);
    },
    Boolean(id),
  );
}

function transformPage(response: OpenFoodFactsSearchResponse, page: number) {
  return transformProductPage(response, page, PRODUCT_PAGE_SIZE);
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
