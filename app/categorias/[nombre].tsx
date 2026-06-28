import { Redirect, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';

import ProductListScreen from '@/src/components/ProductListScreen';
import { categories } from '@/src/data/catalog';
import { useProducts } from '@/src/hooks/useProducts';
import { ROUTES } from '@/src/navigation/routes';
import { getProductsByCategory } from '@/src/services/openFoodFacts';

export default function CategoryProductsScreen() {
  const { nombre } = useLocalSearchParams<{ nombre: string }>();
  const category = categories.find((item) => item.id === nombre);
  const loader = useCallback(
    (page: number, signal: AbortSignal) => getProductsByCategory(nombre ?? '', page, signal),
    [nombre],
  );
  const { products, loading, loadingMore, error, loadMoreError, retry, loadMore, retryLoadMore } = useProducts(loader);

  if (!category) {
    return <Redirect href={ROUTES.HOME} />;
  }

  return (
    <ProductListScreen
      title={category.title}
      countLabel={`${products.length} ITEMS FOUND`}
      placeholder={`Search ${category.label.replaceAll('-', ' ')}`}
      products={products}
      originType="categoria"
      originId={category.id}
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
