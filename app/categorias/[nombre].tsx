import { Redirect, Stack, useLocalSearchParams } from 'expo-router';

import ProductListScreen from '@/src/components/ProductListScreen';
import { categories, products } from '@/src/data/catalog';
import { ROUTES } from '@/src/navigation/routes';

export default function CategoryProductsScreen() {
  const { nombre } = useLocalSearchParams<{ nombre: string }>();
  const category = categories.find((item) => item.id === nombre);

  if (!category) {
    return <Redirect href={ROUTES.HOME} />;
  }

  const categoryProducts = products.filter((product) => product.categoryId === category.id);

  return (
    <>
      <Stack.Screen options={{ title: category.title }} />
      <ProductListScreen
        title={category.title}
        countLabel={`${categoryProducts.length} ITEMS FOUND`}
        placeholder={`Search ${category.label.replaceAll('-', ' ')}`}
        products={categoryProducts}
        originType="categoria"
        originId={category.id}
      />
    </>
  );
}
