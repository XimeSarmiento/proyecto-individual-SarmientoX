import { Redirect, useLocalSearchParams } from 'expo-router';

import FilteredProductsScreen from '@/src/components/FilteredProductsScreen';
import { brands } from '@/src/data/catalog';
import { ROUTES } from '@/src/navigation/routes';
import { getProductsByBrand } from '@/src/services/openFoodFacts';

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
      loadPage={getProductsByBrand}
    />
  );
}
