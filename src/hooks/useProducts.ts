import { useCallback, useEffect, useRef, useState } from 'react';

import type { Product } from '@/src/data/catalog';
import type { ProductPage } from '@/src/services/openFoodFacts';

type ProductLoader = (page: number, signal: AbortSignal) => Promise<ProductPage>;

export function useProducts(loader: ProductLoader) {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadMoreError, setLoadMoreError] = useState(false);
  const [request, setRequest] = useState(0);
  const loadingMoreRef = useRef(false);
  const loadMoreFailedRef = useRef(false);
  const paginationControllerRef = useRef<AbortController | null>(null);
  const retry = useCallback(() => setRequest((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    paginationControllerRef.current?.abort();
    loadingMoreRef.current = false;
    loadMoreFailedRef.current = false;
    setProducts([]);
    setPage(0);
    setHasMore(false);
    setLoading(true);
    setLoadingMore(false);
    setError(null);
    setLoadMoreError(false);

    loader(1, controller.signal)
      .then((result) => {
        setProducts(result.products);
        setPage(result.page);
        setHasMore(result.hasMore);
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) {
          setError(requestError instanceof Error ? requestError.message : 'No se pudieron cargar los productos.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => {
      controller.abort();
      paginationControllerRef.current?.abort();
      loadingMoreRef.current = false;
    };
  }, [loader, request]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading || loadingMoreRef.current || loadMoreFailedRef.current) return;

    const controller = new AbortController();
    paginationControllerRef.current?.abort();
    paginationControllerRef.current = controller;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    setLoadMoreError(false);

    try {
      const result = await loader(page + 1, controller.signal);
      setProducts((current) => {
        const existingIds = new Set(current.map((product) => product.id));
        return [...current, ...result.products.filter((product) => !existingIds.has(product.id))];
      });
      setPage(result.page);
      setHasMore(result.hasMore);
    } catch {
      if (!controller.signal.aborted) {
        loadMoreFailedRef.current = true;
        setLoadMoreError(true);
      }
    } finally {
      if (!controller.signal.aborted) {
        loadingMoreRef.current = false;
        setLoadingMore(false);
      }
    }
  }, [hasMore, loader, loading, page]);

  const retryLoadMore = useCallback(() => {
    loadMoreFailedRef.current = false;
    void loadMore();
  }, [loadMore]);

  return {
    products,
    loading,
    loadingMore,
    error,
    loadMoreError,
    retry,
    loadMore,
    retryLoadMore,
  };
}
