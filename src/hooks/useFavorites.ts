import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getFavorites,
  removeFavorite,
  saveFavorite,
} from '@/src/services/favorites.service';
import type { Product } from '@/src/types/product';

export const FAVORITES_QUERY_KEY = ['favorites'] as const;

export function useFavorites() {
  return useQuery({ queryKey: FAVORITES_QUERY_KEY, queryFn: getFavorites });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ product, isFavorite }: { product: Product; isFavorite: boolean }) => {
      return isFavorite ? removeFavorite(product.id) : saveFavorite(product);
    },
    onSuccess: (favorites) => {
      queryClient.setQueryData(FAVORITES_QUERY_KEY, favorites);
    },
  });
}
