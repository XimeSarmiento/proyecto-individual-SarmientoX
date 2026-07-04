import { Redirect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';

import ProductListScreen from '@/src/components/ProductListScreen';
import { brands } from '@/src/data/catalog';
import { useProducts } from '@/src/hooks/useProducts';
import { ROUTES } from '@/src/navigation/routes';
import { getProductsByBrand } from '@/src/services/openFoodFacts';

export default function BrandProductsScreen() {
  const { nombre } = useLocalSearchParams<{ nombre: string }>();
  const brand = brands.find((item) => item.id === nombre);
  const [query, setQuery] = useState('');
  const loader = useCallback(
    (page: number, signal: AbortSignal) => getProductsByBrand(nombre ?? '', page, signal, query),
    [nombre, query],
  );
  const { products, loading, loadingMore, error, loadMoreError, retry, loadMore, retryLoadMore } = useProducts(loader);

  if (!brand) {
    return <Redirect href={ROUTES.HOME} />;
  }

  return (
    <ProductListScreen
      title={brand.title}
      countLabel={`${products.length} PRODUCTS`}
      placeholder={`Search ${brand.name} products`}
      products={products}
      originType="marca"
      originId={brand.id}
      loading={loading}
      error={error}
      onRetry={retry}
      loadingMore={loadingMore}
      loadMoreError={loadMoreError}
      onLoadMore={loadMore}
      onRetryLoadMore={retryLoadMore}
      onSearchChange={setQuery}
    />
  );
}
