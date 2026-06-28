import { Redirect, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';

import ProductListScreen from '@/src/components/ProductListScreen';
import { tastes } from '@/src/data/catalog';
import { useProducts } from '@/src/hooks/useProducts';
import { ROUTES } from '@/src/navigation/routes';
import { getProductsByTaste } from '@/src/services/openFoodFacts';

export default function TasteProductsScreen() {
  const { nombre } = useLocalSearchParams<{ nombre: string }>();
  const taste = tastes.find((item) => item.id === nombre);
  const loader = useCallback(
    (page: number, signal: AbortSignal) => getProductsByTaste(nombre ?? '', page, signal),
    [nombre],
  );
  const {
    products,
    loading,
    loadingMore,
    error,
    loadMoreError,
    retry,
    loadMore,
    retryLoadMore,
  } = useProducts(loader);

  if (!taste) {
    return <Redirect href={ROUTES.HOME} />;
  }

  return (
    <ProductListScreen
      title={taste.title}
      countLabel={`${products.length} PRODUCTS`}
      placeholder={`Search ${taste.title.toLowerCase()} products`}
      products={products}
      originType="taste"
      originId={taste.id}
      loading={loading}
      error={error}
      onRetry={retry}
      loadingMore={loadingMore}
      loadMoreError={loadMoreError}
      onLoadMore={loadMore}
      onRetryLoadMore={retryLoadMore}
    />
  );
}
