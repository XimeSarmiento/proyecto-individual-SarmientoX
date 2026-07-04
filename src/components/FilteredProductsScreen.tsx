import { useCallback, useState } from 'react';

import { useProducts } from '@/src/hooks/useProducts';
import type { ProductPage } from '@/src/services/openFoodFacts';
import ProductListScreen from './ProductListScreen';

type FilteredProductsScreenProps = {
  title: string;
  countNoun: string;
  placeholder: string;
  originType: 'categoria' | 'marca' | 'taste';
  originId: string;
  loadPage: (id: string, page: number, signal: AbortSignal, query: string) => Promise<ProductPage>;
};

export default function FilteredProductsScreen({
  title,
  countNoun,
  placeholder,
  originType,
  originId,
  loadPage,
}: FilteredProductsScreenProps) {
  const [query, setQuery] = useState('');
  const loader = useCallback(
    (page: number, signal: AbortSignal) => loadPage(originId, page, signal, query),
    [loadPage, originId, query],
  );
  const result = useProducts(loader);

  return (
    <ProductListScreen
      title={title}
      countLabel={`${result.products.length} ${countNoun}`}
      placeholder={placeholder}
      products={result.products}
      originType={originType}
      originId={originId}
      loading={result.loading}
      error={result.error}
      onRetry={result.retry}
      loadingMore={result.loadingMore}
      loadMoreError={result.loadMoreError}
      onLoadMore={result.loadMore}
      onRetryLoadMore={result.retryLoadMore}
      onSearchChange={setQuery}
    />
  );
}
