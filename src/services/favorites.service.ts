import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Product } from '@/src/types/product';

const FAVORITES_KEY = 'favoriteProducts';

export async function getFavorites(): Promise<Product[]> {
  const stored = await AsyncStorage.getItem(FAVORITES_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored) as Product[];
  } catch {
    await AsyncStorage.removeItem(FAVORITES_KEY);
    return [];
  }
}

export async function saveFavorite(product: Product) {
  const favorites = await getFavorites();
  if (favorites.some((favorite) => favorite.id === product.id)) return favorites;

  const updated = [...favorites, product];
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
}

export async function removeFavorite(productId: string) {
  const favorites = await getFavorites();
  const updated = favorites.filter((favorite) => favorite.id !== productId);
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
}
