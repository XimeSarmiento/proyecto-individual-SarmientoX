const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://world.openfoodfacts.org/api';
export const PRODUCT_PAGE_SIZE = 10;
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

export type OpenFoodFactsProduct = {
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

export type OpenFoodFactsSearchResponse = {
  count?: number;
  page?: number;
  page_count?: number;
  page_size?: number;
  products?: OpenFoodFactsProduct[];
};

export type OpenFoodFactsProductResponse = {
  status?: number;
  product?: OpenFoodFactsProduct;
};

export function searchProducts(query: string, page = 1, signal?: AbortSignal) {
  return requestProductPage({ search_terms: query.trim() }, page, signal);
}

export function getRandomProducts(page = 1, signal?: AbortSignal) {
  return requestProductPage({ sort_by: 'random' }, page, signal);
}

export function getProductsByCategory(category: string, page = 1, signal?: AbortSignal, query = '') {
  return requestProductPage(
    { categories_tags: category, ...(query.trim() && { search_terms: query.trim() }) },
    page,
    signal,
  );
}

export function getProductsByBrand(brand: string, page = 1, signal?: AbortSignal, query = '') {
  return requestProductPage(
    { brands_tags: brand, ...(query.trim() && { search_terms: query.trim() }) },
    page,
    signal,
  );
}

export function getProductsByTaste(taste: string, page = 1, signal?: AbortSignal, query = '') {
  return requestProductPage(
    { labels_tags: taste, ...(query.trim() && { search_terms: query.trim() }) },
    page,
    signal,
  );
}

export function getProduct(code: string, signal?: AbortSignal) {
  const params = new URLSearchParams({ fields: PRODUCT_FIELDS });
  return requestJson<OpenFoodFactsProductResponse>(
    `${API_BASE_URL}/v2/product/${encodeURIComponent(code)}?${params}`,
    signal,
  );
}

async function requestProductPage(
  filters: Record<string, string>,
  page: number,
  signal?: AbortSignal,
) {
  const params = new URLSearchParams({
    ...filters,
    fields: PRODUCT_FIELDS,
    page: String(page),
    page_size: String(PRODUCT_PAGE_SIZE),
  });

  return requestJson<OpenFoodFactsSearchResponse>(
    `${API_BASE_URL}/v2/search?${params}`,
    signal,
  );
}

async function requestJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'UNTDF TNT 2026',
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Open Food Facts responded with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}
