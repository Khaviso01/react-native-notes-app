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

    // Create a new account. Returns an error message string, or null on success.
    const register = async (email: string, username: string, password: string): Promise<string | null> => {
        email = email.trim().toLowerCase();
        if (!email.includes('@') || !username.trim() || password.length < 6)
            return 'Enter a valid email, a username and a password of 6+ characters.';

        // check existing stored users to prevent duplicate email registration
        const users = await getUsers();
        if (users.some((u) => u.email === email)) return 'That email is already registered.';
        const u = { id: Date.now().toString(), email, username: username.trim(), pass: await hash(password) };

        // Persist updated user list and immediately mark the new user as the active session.
        await AsyncStorage.setItem('users', JSON.stringify([...users, u]));
        await AsyncStorage.setItem('session', u.id);
        setUser(u);
        return null;
    };

    // Log in by comparing the email and the hashed password.
    const login = async (email: string, password: string): Promise<string | null> => {
        // Look up the stored user record using a trimmed, lowercase email address.
        const u = (await getUsers()).find((x) => x.email === email.trim().toLowerCase());
        if (!u || u.pass !== (await hash(password))) return 'Wrong email or password.';

        // Save active session ID and hydrate authentication state.
        await AsyncStorage.setItem('session', u.id);
        setUser(u);
        return null;
    };

    // Clear the persisted session ID and reset active user state on sign-out.
    const logout = async () => {
        await AsyncStorage.removeItem('session');
        setUser(null);
    };

    // Update email / username / password. The current password is required for safety.
    const updateProfile = async ({ email, username, currentPassword, newPassword }: UpdateArgs): Promise<string | null> => {
        if (!user) return 'You are not logged in.';
        if (user.pass !== (await hash(currentPassword))) return 'Current password is incorrect.';
        email = email.trim().toLowerCase();

        // Prevent claiming an email already assigned to a different user record.
        const users = await getUsers();
        if (users.some((u) => u.email === email && u.id !== user.id)) return 'That email is already in use.';
        if (newPassword && newPassword.length < 6) return 'New password must be 6+ characters.';
        const updated = {
            ...user, email, username: username.trim(),
            pass: newPassword ? await hash(newPassword) : user.pass,
        };

        // Persist the updated user record inside the stored users collection and refresh active state.
        await AsyncStorage.setItem('users', JSON.stringify(users.map((u) => (u.id === user.id ? updated : u))));
        setUser(updated);
        return null;
    };