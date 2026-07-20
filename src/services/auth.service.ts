import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

import { isSupabaseConfigured, supabase } from './supabase';

export const AUTH_CALLBACK_PATH = 'auth';

function ensureSupabaseConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error('Configurá EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY en .env.');
  }
}

export function getAuthRedirectUrl() {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return `${window.location.origin}/${AUTH_CALLBACK_PATH}`;
  }

  return Linking.createURL(AUTH_CALLBACK_PATH);
}

export async function signInWithEmail(email: string, password: string) {
  ensureSupabaseConfigured();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) throw error;
  return data;
}

export async function signUpWithEmail(email: string, password: string) {
  ensureSupabaseConfigured();

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      emailRedirectTo: getAuthRedirectUrl(),
    },
  });

  if (error) throw error;
  return data;
}

export async function resendSignupConfirmation(email: string) {
  ensureSupabaseConfigured();

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email.trim(),
    options: {
      emailRedirectTo: getAuthRedirectUrl(),
    },
  });

  if (error) throw error;
}

export async function signOut() {
  ensureSupabaseConfigured();

  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
