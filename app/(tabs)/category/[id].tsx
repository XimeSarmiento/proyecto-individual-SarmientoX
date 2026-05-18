import { Redirect, useLocalSearchParams } from 'expo-router';

import ProductListScreen from '../../_components/ProductListScreen';
import { categories, products } from '../../../data/catalog';

export default function CategoryProductsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const category = categories.find((item) => item.id === id);

  if (!category) {
    return <Redirect href="/" />;
  }

  const categoryProducts = products.filter((product) => product.categoryId === category.id);

  return (
    <ProductListScreen
      title={category.title}
      countLabel={`${categoryProducts.length} ITEMS FOUND`}
      placeholder={`Search ${category.label.replaceAll('-', ' ')}`}
      products={categoryProducts}
      originType="category"
      originId={category.id}
    />
  );
}
