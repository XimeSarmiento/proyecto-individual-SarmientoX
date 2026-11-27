import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';

import { auth, isFirebaseConfigured } from './firebase';

function ensureConfigured() {
  if (!isFirebaseConfigured) throw new Error('Configurá Firebase en .env y reiniciá Expo.');
}

export async function signInWithEmail(email: string, password: string) {
  ensureConfigured();
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function signUpWithEmail(email: string, password: string) {
  ensureConfigured();
  return createUserWithEmailAndPassword(auth, email.trim(), password);
}

export async function signOut() {
  ensureConfigured();
  return firebaseSignOut(auth);
}
