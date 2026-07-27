import { useQueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

import { FAVORITES_QUERY_KEY } from '@/src/hooks/useFavorites';
import { useAuth } from '@/src/providers/AuthProvider';
import { supabase } from '@/src/services/supabase';

export function FavoritesRealtimeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const channelId = useRef(`favorites:${Date.now()}:${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    if (!user) return;

    const queryKey = [FAVORITES_QUERY_KEY, user.id] as const;
    const channel = supabase
      .channel(`${channelId.current}:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'favorites',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (__DEV__ && Platform.OS === 'web') {
            console.log('[favorites realtime payload]', payload.eventType, payload);
          }

          queryClient.invalidateQueries({ queryKey });
          queryClient.refetchQueries({ queryKey, type: 'active' });
        },
      )
      .subscribe((status, error) => {
        if (__DEV__ && Platform.OS === 'web') {
          console.log('[favorites realtime]', status, error ?? '');
        }
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient, user]);

  return children;
}
