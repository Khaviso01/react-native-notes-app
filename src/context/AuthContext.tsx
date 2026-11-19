import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

// The shape of a stored user (pass is the password HASH, never the real password)
export interface User { id: string; email: string; username: string; pass: string }

// Input payload for updating details
interface UpdateArgs { email: string; username: string; currentPassword: string; newPassword?: string }

// Authentication context contract
interface AuthCtx {
  user: User | null;
  loading: boolean;
  register: (email: string, username: string, password: string) => Promise<string | null>;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  updateProfile: (args: UpdateArgs) => Promise<string | null>;
}

// React context instance holding authentication state and actions 
const AuthContext = createContext<AuthCtx | null>(null);
// Hook for screens; throws a clear error if used outside <AuthProvider>.
export const useAuth = (): AuthCtx => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

// Loading registered users records
const hash = (p: string) => Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, p);
const getUsers = async (): Promise<User[]> => JSON.parse((await AsyncStorage.getItem('users')) || '[]');

// Provider component managing authenticated session state and persistance
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);      // the logged-in user (or null)
  const [loading, setLoading] = useState(true); // true while we check for a saved session

  // Async storage to restore the previous session if there is one.
  useEffect(() => {
    (async () => {
      const id = await AsyncStorage.getItem('session');
      const found = (await getUsers()).find((u) => u.id === id);
      setUser(found || null);
      setLoading(false);
    })();
  }, []);