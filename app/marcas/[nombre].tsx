import { Redirect, useLocalSearchParams } from 'expo-router';

import FilteredProductsScreen from '@/src/components/FilteredProductsScreen';
import { brands } from '@/src/data/filters';
import { useProductsByBrand } from '@/src/hooks/useProductQueries';
import { ROUTES } from '@/src/navigation/routes';

export default function BrandProductsScreen() {
  const { nombre } = useLocalSearchParams<{ nombre: string }>();
  const brand = brands.find((item) => item.id === nombre);
  if (!brand) return <Redirect href={ROUTES.HOME} />;

  return (
    <FilteredProductsScreen
      title={brand.title}
      countNoun="PRODUCTS"
      placeholder={`Search ${brand.name} products`}
      originType="marca"
      originId={brand.id}
      useProductsHook={useProductsByBrand}
    />
  );
}
