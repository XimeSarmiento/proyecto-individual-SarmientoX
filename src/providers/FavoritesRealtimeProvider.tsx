import { useQueryClient } from '@tanstack/react-query';
import { onSnapshot } from 'firebase/firestore';
import type { ReactNode } from 'react';
import { useEffect } from 'react';

import { FAVORITES_QUERY_KEY } from '@/src/hooks/useFavorites';
import { useAuth } from '@/src/providers/AuthProvider';
import { favoritesCollection } from '@/src/services/favorites.service';
import type { Product } from '@/src/types/product';

export function FavoritesRealtimeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    const queryKey = [FAVORITES_QUERY_KEY, user.uid] as const;
    return onSnapshot(favoritesCollection(user.uid), (snapshot) => {
      const favorites = snapshot.docs
        .map((favorite) => favorite.data() as { product: Product; savedAt: number })
        .sort((a, b) => b.savedAt - a.savedAt)
        .map((favorite) => favorite.product);
      queryClient.setQueryData(queryKey, favorites);
    }, () => {
      void queryClient.invalidateQueries({ queryKey });
    });
  }, [queryClient, user?.uid]);

  return children;
}
