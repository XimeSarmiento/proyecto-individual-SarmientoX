import { Redirect, useLocalSearchParams } from 'expo-router';

import FilteredProductsScreen from '@/src/components/FilteredProductsScreen';
import { tastes } from '@/src/data/filters';
import { ROUTES } from '@/src/navigation/routes';
import { getProductsByTaste } from '@/src/services/openFoodFacts';

export default function TasteProductsScreen() {
  const { nombre } = useLocalSearchParams<{ nombre: string }>();
  const taste = tastes.find((item) => item.id === nombre);
  if (!taste) return <Redirect href={ROUTES.HOME} />;

  return (
    <FilteredProductsScreen
      title={taste.title}
      countNoun="PRODUCTS"
      placeholder={`Search ${taste.title.toLowerCase()} products`}
      originType="taste"
      originId={taste.id}
      loadPage={getProductsByTaste}
    />
  );
}
