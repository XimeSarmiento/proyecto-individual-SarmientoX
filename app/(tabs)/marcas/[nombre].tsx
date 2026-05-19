import { Redirect, useLocalSearchParams } from 'expo-router';

import ProductListScreen from '@/src/components/ProductListScreen';
import { brands, products } from '@/src/data/catalog';
import { ROUTES } from '@/src/navigation/routes';

export default function BrandProductsScreen() {
  const { nombre } = useLocalSearchParams<{ nombre: string }>();
  const brand = brands.find((item) => item.id === nombre);

  if (!brand) {
    return <Redirect href={ROUTES.HOME} />;
  }

  const brandProducts = products.filter((product) => product.brandId === brand.id);

  return (
    <ProductListScreen
      title={brand.title}
      countLabel={`${brandProducts.length} PRODUCTS`}
      placeholder={`Search ${brand.name} products`}
      products={brandProducts}
      originType="marca"
      originId={brand.id}
    />
  );
}
