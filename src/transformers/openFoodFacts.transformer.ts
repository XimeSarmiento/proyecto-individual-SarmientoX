import type { Product } from '@/src/types/product';
import type {
  OpenFoodFactsProduct,
  OpenFoodFactsProductResponse,
  OpenFoodFactsSearchResponse,
} from '@/src/services/openFoodFacts';

export type ProductPage = {
  products: Product[];
  page: number;
  hasMore: boolean;
};

const NUTRITION_KEYS = [
  'energy-kj_100g',
  'fat_100g',
  'saturated-fat_100g',
  'carbohydrates_100g',
  'sugars_100g',
  'fiber_100g',
  'proteins_100g',
  'salt_100g',
] as const;

export function transformProductPage(
  data: OpenFoodFactsSearchResponse,
  requestedPage: number,
  pageSize: number,
): ProductPage {
  const page = data.page ?? requestedPage;
  const pageCount = data.page_count ?? 0;

  return {
    products: (data.products ?? []).filter(hasIdentity).map(transformProduct),
    page,
    hasMore: pageCount ? page < pageCount : (data.products?.length ?? 0) === pageSize,
  };
}

export function transformProductResponse(data: OpenFoodFactsProductResponse): Product | null {
  return data.status === 1 && data.product && hasIdentity(data.product)
    ? transformProduct(data.product)
    : null;
}

function hasIdentity(
  product: OpenFoodFactsProduct,
): product is OpenFoodFactsProduct & { code: string } {
  return Boolean(product.code && product.product_name?.trim());
}

function transformProduct(product: OpenFoodFactsProduct & { code: string }): Product {
  const nutriments = product.nutriments ?? {};
  const ingredients = product.ingredients_text?.trim();
  const value = (key: string, unit = 'g') => formatNutriment(nutriments[key], unit);
  const energyKj = value('energy-kj_100g', 'kJ');
  const allergens = product.allergens?.trim() || product.allergens_tags?.map(cleanTag).join(', ');

  return {
    id: product.code,
    name: product.product_name?.trim() || 'Unnamed product',
    maker: product.brands?.split(',')[0]?.trim() || 'Unknown brand',
    categoryId: cleanTag(product.categories_tags?.[0] ?? 'other'),
    brandId: slugify(product.brands?.split(',')[0] ?? 'unknown'),
    nutriScore: normalizeGrade(product.nutriscore_grade),
    ecoScore: normalizeEcoScore(product.ecoscore_grade),
    novaGroup: normalizeNova(product.nova_group),
    imageUrl: product.image_front_url,
    energy: energyKj,
    fat: value('fat_100g'),
    protein: value('proteins_100g'),
    ingredients: ingredients || '',
    hasIngredients: Boolean(ingredients),
    allergens: allergens || 'Allergen information unavailable.',
    hasNutritionInfo: NUTRITION_KEYS.some(
      (key) => nutriments[key] !== undefined && nutriments[key] !== '',
    ),
    nutrition: [
      { label: 'Energy', value: energyKj },
      { label: 'Fat', value: value('fat_100g') },
      { label: '— of which saturated', value: value('saturated-fat_100g'), detail: true },
      { label: 'Carbohydrates', value: value('carbohydrates_100g') },
      { label: '— of which sugars', value: value('sugars_100g'), detail: true },
      { label: 'Fiber', value: value('fiber_100g') },
      { label: 'Protein', value: value('proteins_100g') },
      { label: 'Salt', value: value('salt_100g') },
    ],
  };
}

function formatNutriment(value: string | number | undefined, unit: string) {
  if (value === undefined || value === '') return 'N/D';
  const normalized = typeof value === 'number' ? Math.round(value * 100) / 100 : value;
  return `${normalized} ${unit}`;
}

function cleanTag(value: string) {
  return value.replace(/^[a-z]{2}:/, '').replaceAll('-', ' ');
}

function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function normalizeGrade(value?: string): Product['nutriScore'] {
  const grade = value?.toUpperCase();
  return grade && ['A', 'B', 'C', 'D', 'E'].includes(grade) ? grade as Product['nutriScore'] : '-';
}

function normalizeEcoScore(value?: string): Product['ecoScore'] {
  const grade = value?.toUpperCase();
  return grade && ['A', 'B', 'C', 'D', 'E'].includes(grade) ? grade as Product['ecoScore'] : '-';
}

function normalizeNova(value?: number): Product['novaGroup'] {
  return value && [1, 2, 3, 4].includes(value) ? value as Product['novaGroup'] : '?';
}
