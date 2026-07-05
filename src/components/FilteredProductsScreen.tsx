import { useState } from 'react';

import { useProductsByCategory } from '@/src/hooks/useProductQueries';
import ProductListScreen from './ProductListScreen';

type ProductsQueryHook = typeof useProductsByCategory;

type FilteredProductsScreenProps = {
  title: string;
  countNoun: string;
  placeholder: string;
  originType: 'categoria' | 'marca' | 'taste';
  originId: string;
  useProductsHook: ProductsQueryHook;
};

export default function FilteredProductsScreen({
  title,
  countNoun,
  placeholder,
  originType,
  originId,
  useProductsHook,
}: FilteredProductsScreenProps) {
  const [query, setQuery] = useState('');
  const result = useProductsHook(originId, query);

  return (
    <ProductListScreen
      title={title}
      countLabel={`${result.products.length} ${countNoun}`}
      placeholder={placeholder}
      products={result.products}
      originType={originType}
      originId={originId}
      loading={result.isPending}
      error={result.error instanceof Error ? result.error.message : null}
      onRetry={() => result.refetch()}
      loadingMore={result.isFetchingNextPage}
      loadMoreError={result.isFetchNextPageError}
      onLoadMore={() => {
        if (result.hasNextPage && !result.isFetchingNextPage) void result.fetchNextPage();
      }}
      onRetryLoadMore={() => result.fetchNextPage()}
      onSearchChange={setQuery}
    />
  );
}
