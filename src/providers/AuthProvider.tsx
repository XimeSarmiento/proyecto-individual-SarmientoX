import type { Session, User } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { isSupabaseConfigured, supabase } from '@/src/services/supabase';

type AuthContextValue = {
  initialized: boolean;
  session: Session | null;
  user: User | null;
  isConfigured: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setInitialized(true);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setInitialized(true);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setInitialized(true);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    async function createSessionFromUrl(url: string) {
      const params = getAuthParamsFromUrl(url);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (!accessToken || !refreshToken) return;

      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (!error) {
        setSession(data.session);
      }
    }

    Linking.getInitialURL().then((url) => {
      if (url) void createSessionFromUrl(url);
    });

    const subscription = Linking.addEventListener('url', ({ url }) => {
      void createSessionFromUrl(url);
    });

    return () => subscription.remove();
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    initialized,
    session,
    user: session?.user ?? null,
    isConfigured: isSupabaseConfigured,
  }), [initialized, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function getAuthParamsFromUrl(url: string) {
  const query = url.includes('?') ? url.split('?')[1]?.split('#')[0] : '';
  const hash = url.includes('#') ? url.split('#')[1] : '';

  return new URLSearchParams([query, hash].filter(Boolean).join('&'));
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
