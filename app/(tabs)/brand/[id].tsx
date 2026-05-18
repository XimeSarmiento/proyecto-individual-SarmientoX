import { Redirect, useLocalSearchParams } from 'expo-router';

import ProductListScreen from '../../_components/ProductListScreen';
import { brands, products } from '../../../data/catalog';

export default function BrandProductsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const brand = brands.find((item) => item.id === id);

  if (!brand) {
    return <Redirect href="/" />;
  }

  const brandProducts = products.filter((product) => product.brandId === brand.id);

  return (
    <ProductListScreen
      title={brand.title}
      countLabel={`${brandProducts.length} PRODUCTS`}
      placeholder={`Search ${brand.name} products`}
      products={brandProducts}
      originType="brand"
      originId={brand.id}
    />
  );
}
