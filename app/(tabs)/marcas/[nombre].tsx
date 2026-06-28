import { Redirect, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';

import ProductListScreen from '@/src/components/ProductListScreen';
import { brands } from '@/src/data/catalog';
import { useProducts } from '@/src/hooks/useProducts';
import { ROUTES } from '@/src/navigation/routes';
import { getProductsByBrand } from '@/src/services/openFoodFacts';

export default function BrandProductsScreen() {
  const { nombre } = useLocalSearchParams<{ nombre: string }>();
  const brand = brands.find((item) => item.id === nombre);
  const loader = useCallback(
    (signal: AbortSignal) => getProductsByBrand(nombre ?? '', signal),
    [nombre],
  );
  const { products, loading, error, retry } = useProducts(loader);

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
    />
  );
}
