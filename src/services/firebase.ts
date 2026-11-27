import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import * as FirebaseAuth from 'firebase/auth';
import type { Auth, Persistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Object.values(config).every(
  (value) => Boolean(value && !value.startsWith('REPLACE_')),
);

const app = getApps().length ? getApp() : initializeApp({
  apiKey: config.apiKey ?? 'REPLACE_API_KEY',
  authDomain: config.authDomain ?? 'REPLACE_AUTH_DOMAIN',
  projectId: config.projectId ?? 'REPLACE_PROJECT_ID',
  appId: config.appId ?? 'REPLACE_APP_ID',
});

// Metro resolves the React Native entry point; TypeScript sees the web declaration.
const nativePersistence = (FirebaseAuth as typeof FirebaseAuth & {
  getReactNativePersistence: (storage: typeof AsyncStorage) => Persistence;
}).getReactNativePersistence;

function getConfiguredAuth(): Auth {
  if (Platform.OS === 'web') return FirebaseAuth.getAuth(app);
  try {
    return FirebaseAuth.initializeAuth(app, { persistence: nativePersistence(AsyncStorage) });
  } catch (error) {
    if (error instanceof Error && error.message.includes('already-initialized')) {
      return FirebaseAuth.getAuth(app);
    }
    throw error;
  }
}

export const auth = getConfiguredAuth();

export const db = getFirestore(app);
