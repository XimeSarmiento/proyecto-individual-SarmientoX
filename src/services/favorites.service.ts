import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';

import type { Product } from '@/src/types/product';

import { auth, db } from './firebase';

export function favoritesCollection(userId: string) {
  return collection(db, 'users', userId, 'favorites');
}

function currentUserId() {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error('You must be logged in to manage favorites.');
  return userId;
}

export async function getFavorites(): Promise<Product[]> {
  const snapshot = await getDocs(favoritesCollection(currentUserId()));
  return snapshot.docs.map((favorite) => favorite.data().product as Product);
}

export async function saveFavorite(product: Product) {
  const userId = currentUserId();
  const productId = encodeURIComponent(product.id);
  await setDoc(doc(favoritesCollection(userId), productId), {
    product: JSON.parse(JSON.stringify(product)) as Product,
    savedAt: Date.now(),
  });
  return getFavorites();
}

export async function removeFavorite(productId: string) {
  const userId = currentUserId();
  await deleteDoc(doc(favoritesCollection(userId), encodeURIComponent(productId)));
  return getFavorites();
}
