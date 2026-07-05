import {
  transformProductPage,
  transformProductResponse,
  type OpenFoodFactsProductResponse,
  type OpenFoodFactsSearchResponse,
  type ProductPage,
} from '@/src/transformers/openFoodFacts.transformer';
import type { Product } from '@/src/types/product';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://world.openfoodfacts.org/api';
const PAGE_SIZE = 10;
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

export async function searchProducts(
  query: string,
  page = 1,
  signal?: AbortSignal,
): Promise<ProductPage> {
  const normalizedQuery = query.trim();
  if (/^\d{8,14}$/.test(normalizedQuery)) {
    const product = await getProduct(normalizedQuery, signal);
    return { products: product ? [product] : [], page: 1, hasMore: false };
  }

  return requestTextSearch(normalizedQuery, page, signal);
}

export function getRandomProducts(page = 1, signal?: AbortSignal) {
  return requestProductPage({ sort_by: 'random' }, page, signal);
}

export function getProductsByCategory(category: string, page = 1, signal?: AbortSignal, query = '') {
  return query.trim()
    ? requestTextSearch(query.trim(), page, signal, { type: 'categories', value: category })
    : requestProductPage({ categories_tags_en: category }, page, signal);
}

export function getProductsByBrand(brand: string, page = 1, signal?: AbortSignal, query = '') {
  return query.trim()
    ? requestTextSearch(query.trim(), page, signal, { type: 'brands', value: brand })
    : requestProductPage({ brands_tags: brand }, page, signal);
}

export function getProductsByTaste(taste: string, page = 1, signal?: AbortSignal, query = '') {
  return query.trim()
    ? requestTextSearch(query.trim(), page, signal, { type: 'labels', value: taste })
    : requestProductPage({ labels_tags_en: taste }, page, signal);
}

export async function getProduct(code: string, signal?: AbortSignal): Promise<Product | null> {
  const params = new URLSearchParams({ fields: PRODUCT_FIELDS });
  const data = await requestJson<OpenFoodFactsProductResponse>(
    `${API_BASE_URL}/v2/product/${encodeURIComponent(code)}?${params}`,
    signal,
  );
  return transformProductResponse(data);
}

async function requestTextSearch(
  query: string,
  page: number,
  signal?: AbortSignal,
  tag?: { type: 'categories' | 'brands' | 'labels'; value: string },
) {
  const params = new URLSearchParams({
    action: 'process',
    search_terms: query,
    fields: PRODUCT_FIELDS,
    page: String(page),
    page_size: String(PAGE_SIZE),
    json: '1',
  });

  if (tag) {
    params.set('tagtype_0', tag.type);
    params.set('tag_contains_0', 'contains');
    params.set('tag_0', tag.value);
  }

  const origin = API_BASE_URL.replace(/\/api\/?$/, '');
  const data = await requestJson<OpenFoodFactsSearchResponse>(
    `${origin}/cgi/search.pl?${params}`,
    signal,
  );
  return transformProductPage(data, page, PAGE_SIZE);
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
    page_size: String(PAGE_SIZE),
    json: '1',
  });
  const data = await requestJson<OpenFoodFactsSearchResponse>(
    `${API_BASE_URL}/v2/search?${params}`,
    signal,
  );
  return transformProductPage(data, page, PAGE_SIZE);
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
    throw new Error(`Open Food Facts respondió con estado ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export type { ProductPage } from '@/src/transformers/openFoodFacts.transformer';
