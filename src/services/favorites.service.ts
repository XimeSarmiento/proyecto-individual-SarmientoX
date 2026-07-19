import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Product } from '@/src/types/product';

import { isSupabaseConfigured, supabase } from './supabase';

const FAVORITES_KEY = 'favoriteProducts';
const FAVORITES_TABLE = 'favorites';

type FavoriteRow = {
  product: Product;
};

export async function getFavorites(): Promise<Product[]> {
  const userId = await getCurrentUserId();
  if (userId) {
    const { data, error } = await supabase
      .from(FAVORITES_TABLE)
      .select('product')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return ((data ?? []) as FavoriteRow[]).map((row) => row.product);
  }

  return getLocalFavorites();
}

export async function saveFavorite(product: Product) {
  const userId = await getCurrentUserId();
  if (userId) {
    const { error } = await supabase
      .from(FAVORITES_TABLE)
      .upsert({
        user_id: userId,
        product_id: product.id,
        product,
      }, { onConflict: 'user_id,product_id' });

    if (error) throw error;
    return getFavorites();
  }

  return saveLocalFavorite(product);
}

export async function removeFavorite(productId: string) {
  const userId = await getCurrentUserId();
  if (userId) {
    const { error } = await supabase
      .from(FAVORITES_TABLE)
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) throw error;
    return getFavorites();
  }

  return removeLocalFavorite(productId);
}

async function getCurrentUserId() {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error) return null;

  return data.user?.id ?? null;
}

async function getLocalFavorites(): Promise<Product[]> {
  const stored = await AsyncStorage.getItem(FAVORITES_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored) as Product[];
  } catch {
    await AsyncStorage.removeItem(FAVORITES_KEY);
    return [];
  }
}

async function saveLocalFavorite(product: Product) {
  const favorites = await getLocalFavorites();
  if (favorites.some((favorite) => favorite.id === product.id)) return favorites;

  const updated = [...favorites, product];
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
}

async function removeLocalFavorite(productId: string) {
  const favorites = await getLocalFavorites();
  const updated = favorites.filter((favorite) => favorite.id !== productId);
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
}
