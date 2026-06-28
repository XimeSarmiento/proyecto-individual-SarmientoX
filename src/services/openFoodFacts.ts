import type { Product } from '@/src/data/catalog';

const API_BASE_URL = 'https://world.openfoodfacts.org/api';
const PRODUCT_FIELDS = [
  'code',
  'product_name',
  'brands',
  'categories_tags',
  'nutriscore_grade',
  'ecoscore_grade',
  'nova_group',
  'image_front_url',
  'ingredients_text',
  'allergens',
  'allergens_tags',
  'nutriments',
].join(',');

type OffProduct = {
  code?: string;
  product_name?: string;
  brands?: string;
  categories_tags?: string[];
  nutriscore_grade?: string;
  ecoscore_grade?: string;
  nova_group?: number;
  image_front_url?: string;
  ingredients_text?: string;
  allergens?: string;
  allergens_tags?: string[];
  nutriments?: Record<string, string | number | undefined>;
};

type SearchResponse = {
  count?: number;
  page?: number;
  page_count?: number;
  page_size?: number;
  products?: OffProduct[];
};
type ProductResponse = { status?: number; product?: OffProduct };

export type ProductPage = {
  products: Product[];
  page: number;
  hasMore: boolean;
};

export async function searchProducts(
  query: string,
  page = 1,
  signal?: AbortSignal,
): Promise<ProductPage> {
  return requestProductPage({ search_terms: query }, page, 10, signal);
}

export async function getProductsByCategory(category: string, page = 1, signal?: AbortSignal) {
  return requestProductPage({ categories_tags_en: category }, page, 10, signal);
}

export async function getProductsByBrand(brand: string, page = 1, signal?: AbortSignal) {
  return requestProductPage({ brands_tags: brand }, page, 10, signal);
}

export async function getProductsByTaste(taste: string, page = 1, signal?: AbortSignal) {
  return requestProductPage({ labels_tags_en: taste }, page, 10, signal);
}

async function requestProductPage(
  filters: Record<string, string>,
  page: number,
  pageSize: number,
  signal?: AbortSignal,
): Promise<ProductPage> {
  const params = new URLSearchParams({
    ...filters,
    fields: PRODUCT_FIELDS,
    page: String(page),
    page_size: String(pageSize),
    json: '1',
  });
  const response = await fetch(`${API_BASE_URL}/v2/search?${params}`, {
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Open Food Facts respondió con estado ${response.status}`);
  }

  const data = (await response.json()) as SearchResponse;
  const responsePage = data.page ?? page;
  const pageCount = data.page_count ?? 0;
  return {
    products: (data.products ?? []).filter(hasIdentity).map(mapProduct),
    page: responsePage,
    hasMore: pageCount ? responsePage < pageCount : (data.products?.length ?? 0) === pageSize,
  };
}

export async function getProduct(code: string, signal?: AbortSignal): Promise<Product | null> {
  const params = new URLSearchParams({ fields: PRODUCT_FIELDS });
  const response = await fetch(`${API_BASE_URL}/v2/product/${encodeURIComponent(code)}?${params}`, {
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Open Food Facts respondió con estado ${response.status}`);
  }

  const data = (await response.json()) as ProductResponse;
  return data.status === 1 && data.product && hasIdentity(data.product)
    ? mapProduct(data.product)
    : null;
}

function hasIdentity(product: OffProduct): product is OffProduct & { code: string } {
  return Boolean(product.code && product.product_name?.trim());
}

function mapProduct(product: OffProduct & { code: string }): Product {
  const nutriments = product.nutriments ?? {};
  const value = (key: string, unit = 'g') => formatNutriment(nutriments[key], unit);
  const energyKj = value('energy-kj_100g', 'kJ');
  const allergens = product.allergens?.trim() || product.allergens_tags?.map(cleanTag).join(', ');

  return {
    id: product.code,
    name: product.product_name?.trim() || 'Producto sin nombre',
    maker: product.brands?.split(',')[0]?.trim() || 'Marca desconocida',
    categoryId: cleanTag(product.categories_tags?.[0] ?? 'other'),
    brandId: slugify(product.brands?.split(',')[0] ?? 'unknown'),
    nutriScore: normalizeGrade(product.nutriscore_grade),
    ecoScore: normalizeEcoScore(product.ecoscore_grade),
    novaGroup: normalizeNova(product.nova_group),
    imageUrl: product.image_front_url,
    energy: energyKj,
    fat: value('fat_100g'),
    protein: value('proteins_100g'),
    ingredients: product.ingredients_text?.trim() || 'Ingredientes no informados.',
    allergens: allergens || 'Alérgenos no informados.',
    nutrition: [
      { label: 'Energía', value: energyKj },
      { label: 'Grasas', value: value('fat_100g') },
      { label: '— de las cuales saturadas', value: value('saturated-fat_100g'), detail: true },
      { label: 'Carbohidratos', value: value('carbohydrates_100g') },
      { label: '— de los cuales azúcares', value: value('sugars_100g'), detail: true },
      { label: 'Fibra', value: value('fiber_100g') },
      { label: 'Proteínas', value: value('proteins_100g') },
      { label: 'Sal', value: value('salt_100g') },
    ],
  };
}

function formatNutriment(value: string | number | undefined, unit: string) {
  if (value === undefined || value === '') return 'N/D';
  const numericValue = typeof value === 'number' ? Math.round(value * 100) / 100 : value;
  return `${numericValue} ${unit}`;
}

function cleanTag(value: string) {
  return value.replace(/^[a-z]{2}:/, '').replaceAll('-', ' ');
}

function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function normalizeGrade(value?: string): Product['nutriScore'] {
  const grade = value?.toUpperCase();
  return grade && ['A', 'B', 'C', 'D', 'E'].includes(grade) ? (grade as Product['nutriScore']) : '?';
}

function normalizeEcoScore(value?: string): Product['ecoScore'] {
  const grade = value?.toUpperCase();
  return grade && ['A', 'B', 'C', 'D', 'E'].includes(grade) ? (grade as Product['ecoScore']) : '?';
}

function normalizeNova(value?: number): Product['novaGroup'] {
  return value && [1, 2, 3, 4].includes(value) ? (value as Product['novaGroup']) : '?';
}
