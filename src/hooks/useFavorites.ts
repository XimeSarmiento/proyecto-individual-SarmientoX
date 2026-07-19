import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

  return useQuery({
    queryKey: [FAVORITES_QUERY_KEY, user?.id ?? 'guest'],
    queryFn: getFavorites,
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
