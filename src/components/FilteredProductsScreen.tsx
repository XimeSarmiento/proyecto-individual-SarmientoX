import { useState } from 'react';

import { useFilteredProducts, type ProductFilterType } from '@/src/hooks/useProductQueries';
import ProductListScreen from './ProductListScreen';

type FilteredProductsScreenProps = {
  title: string;
  countNoun: string;
  placeholder: string;
  originType: ProductFilterType;
  originId: string;
};

export default function FilteredProductsScreen({
  title,
  countNoun,
  placeholder,
  originType,
  originId,
}: FilteredProductsScreenProps) {
  const [query, setQuery] = useState('');
  const result = useFilteredProducts(originType, originId, query);
  const initialError = result.products.length === 0 && result.error instanceof Error
    ? result.error.message
    : null;

  return (
    <ProductListScreen
      title={title}
      countLabel={`${result.products.length} ${countNoun}`}
      placeholder={placeholder}
      products={result.products}
      originType={originType}
      originId={originId}
      loading={result.isPending}
      error={initialError}
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
