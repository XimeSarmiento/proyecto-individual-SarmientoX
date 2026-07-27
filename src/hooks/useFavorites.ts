import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import {
  getFavorites,
  removeFavorite,
  saveFavorite,
} from '@/src/services/favorites.service';
import { useAuth } from '@/src/providers/AuthProvider';
import type { Product } from '@/src/types/product';

export const FAVORITES_QUERY_KEY = 'favorites';

export function useFavorites() {
  const { user } = useAuth();
  const queryKey = useMemo(
    () => [FAVORITES_QUERY_KEY, user?.id ?? 'guest'] as const,
    [user?.id],
  );

  return useQuery({
    queryKey,
    queryFn: getFavorites,
    enabled: Boolean(user),
    refetchInterval: user ? 3000 : false,
    refetchOnWindowFocus: true,
  });
}

export function useToggleFavorite() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = [FAVORITES_QUERY_KEY, user?.id ?? 'guest'] as const;

  return useMutation({
    mutationFn: async ({ product, isFavorite }: { product: Product; isFavorite: boolean }) => {
      return isFavorite ? removeFavorite(product.id) : saveFavorite(product);
    },
    onSuccess: (favorites) => {
      queryClient.setQueryData(queryKey, favorites);
    },
  });
}
