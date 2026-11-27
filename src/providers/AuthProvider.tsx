import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { auth, isFirebaseConfigured } from '@/src/services/firebase';

type AuthContextValue = {
  initialized: boolean;
  user: User | null;
  isConfigured: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [initialized, setInitialized] = useState(!isFirebaseConfigured);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setInitialized(true);
    }, () => setInitialized(true));
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    initialized,
    user,
    isConfigured: isFirebaseConfigured,
  }), [initialized, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
