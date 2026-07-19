import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SupportedStorage } from '@supabase/supabase-js';
import { createClient, processLock } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl
    && supabasePublishableKey
    && !supabaseUrl.includes('tu-proyecto')
    && !supabasePublishableKey.includes('tu_publishable_key'),
);

const isServerRender = Platform.OS === 'web' && typeof window === 'undefined';

const authStorage: SupportedStorage = {
  getItem: (key) => {
    if (isServerRender) return null;
    return AsyncStorage.getItem(key);
  },
  setItem: (key, value) => {
    if (isServerRender) return;
    return AsyncStorage.setItem(key, value);
  },
  removeItem: (key) => {
    if (isServerRender) return;
    return AsyncStorage.removeItem(key);
  },
};

export const supabase = createClient(
  supabaseUrl ?? 'https://example.supabase.co',
  supabasePublishableKey ?? 'missing-publishable-key',
  {
    auth: {
      storage: authStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      lock: processLock,
    },
  },
);

if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}
