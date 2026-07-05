import { Redirect, useLocalSearchParams } from 'expo-router';

import FilteredProductsScreen from '@/src/components/FilteredProductsScreen';
import { categories } from '@/src/data/filters';
import { useProductsByCategory } from '@/src/hooks/useProductQueries';
import { ROUTES } from '@/src/navigation/routes';

export default function CategoryProductsScreen() {
  const { nombre } = useLocalSearchParams<{ nombre: string }>();
  const category = categories.find((item) => item.id === nombre);
  if (!category) return <Redirect href={ROUTES.HOME} />;

  return (
    <FilteredProductsScreen
      title={category.title}
      countNoun="ITEMS FOUND"
      placeholder={`Search ${category.label.replaceAll('-', ' ')}`}
      originType="categoria"
      originId={category.id}
      useProductsHook={useProductsByCategory}
    />
  );
}
