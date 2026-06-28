import { useCallback, useEffect, useState } from 'react';

import type { Product } from '@/src/data/catalog';

type ProductLoader = (signal: AbortSignal) => Promise<Product[]>;

export function useProducts(loader: ProductLoader) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [request, setRequest] = useState(0);
  const retry = useCallback(() => setRequest((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    loader(controller.signal)
      .then(setProducts)
      .catch((requestError) => {
        if (!controller.signal.aborted) {
          setProducts([]);
          setError(requestError instanceof Error ? requestError.message : 'No se pudieron cargar los productos.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [loader, request]);

  return { products, loading, error, retry };
}
