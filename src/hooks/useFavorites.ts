import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useId, useMemo } from 'react';

import {
  getFavorites,
  removeFavorite,
  saveFavorite,
} from '@/src/services/favorites.service';
import { useAuth } from '@/src/providers/AuthProvider';
import { supabase } from '@/src/services/supabase';
import type { Product } from '@/src/types/product';

export const FAVORITES_QUERY_KEY = 'favorites';

export function useFavorites() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const subscriptionId = useId();
  const queryKey = useMemo(
    () => [FAVORITES_QUERY_KEY, user?.id ?? 'guest'] as const,
    [user?.id],
  );

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`favorites:${user.id}:${subscriptionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'favorites',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient, queryKey, subscriptionId, user]);

  return useQuery({
    queryKey,
    queryFn: getFavorites,
    enabled: Boolean(user),
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
