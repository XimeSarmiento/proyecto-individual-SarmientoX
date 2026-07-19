import { isSupabaseConfigured, supabase } from './supabase';

function ensureSupabaseConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error('Configurá EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY en .env.');
  }
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
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  ensureSupabaseConfigured();

  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
