import type { Product } from '@/src/types/product';

import { isSupabaseConfigured, supabase } from './supabase';

const FAVORITES_TABLE = 'favorites';

type FavoriteRow = {
  product: Product;
};

export async function getFavorites(): Promise<Product[]> {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('You must be logged in to view favorites.');

  const { data, error } = await supabase
    .from(FAVORITES_TABLE)
    .select('product')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return ((data ?? []) as FavoriteRow[]).map((row) => row.product);
}

export async function saveFavorite(product: Product) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('You must be logged in to save favorites.');

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

export async function removeFavorite(productId: string) {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('You must be logged in to remove favorites.');

  const { error } = await supabase
    .from(FAVORITES_TABLE)
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);

  if (error) throw error;
  return getFavorites();
}

async function getCurrentUserId() {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error) return null;

  return data.user?.id ?? null;
}
