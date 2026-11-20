import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import * as Linking from 'expo-linking';
import { sendResetEmail } from '../services/email';
import { validatePassword } from '../utils/password';

// The shape of a stored user 
export interface User { id: string; email: string; username: string; pass: string }
interface UpdateArgs { email: string; username: string; currentPassword: string; newPassword?: string }
// A pending password reset. We store a HASH of the token, like a password.
interface ResetRecord { email: string; tokenHash: string; expires: number }

// Functions to return an error message string, or null when they succeed.
interface AuthCtx {
    user: User | null;
    loading: boolean;
    register: (email: string, username: string, password: string) => Promise<string | null>;
    login: (email: string, password: string) => Promise<string | null>;
    logout: () => Promise<void>;
    updateProfile: (args: UpdateArgs) => Promise<string | null>;
    requestPasswordReset: (email: string) => Promise<string | null>;
    resetPassword: (email: string, token: string, newPassword: string) => Promise<string | null>;
}

const AuthContext = createContext<AuthCtx | null>(null);
// Hook for screens; throws a clear error if used outside <AuthProvider>.
export const useAuth = (): AuthCtx => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};

const RESET_MINUTES = 30; // how long a reset link stays valid

// Passwords are never stored in plain text: we save a SHA-256 hash instead.
const hash = (p: string) => Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, p);
const getUsers = async (): Promise<User[]> => JSON.parse((await AsyncStorage.getItem('users')) || '[]');
const getResets = async (): Promise<ResetRecord[]> => JSON.parse((await AsyncStorage.getItem('resets')) || '[]');

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);      // the logged-in user (or null)
    const [loading, setLoading] = useState(true); // true while we check for a saved session

    // On app start, restore the previous session if there is one.
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
        if (!email.includes('@') || !username.trim()) return 'Enter a valid email and a username.';
        const pwError = validatePassword(password);
        if (pwError) return pwError;
        const users = await getUsers();
        if (users.some((u) => u.email === email)) return 'That email is already registered.';
        const u = { id: Date.now().toString(), email, username: username.trim(), pass: await hash(password) };
        await AsyncStorage.setItem('users', JSON.stringify([...users, u]));
        await AsyncStorage.setItem('session', u.id);
        setUser(u);
        return null;
    };

    // Log in by comparing the email and the hashed password.
    const login = async (email: string, password: string): Promise<string | null> => {
        const u = (await getUsers()).find((x) => x.email === email.trim().toLowerCase());
        if (!u || u.pass !== (await hash(password))) return 'Wrong email or password.';
        await AsyncStorage.setItem('session', u.id);
        setUser(u);
        return null;
    };

    const logout = async () => {
        await AsyncStorage.removeItem('session');
        setUser(null);
    };

    // Update email / username / password. The current password is required for safety.
    const updateProfile = async ({ email, username, currentPassword, newPassword }: UpdateArgs): Promise<string | null> => {
        if (!user) return 'You are not logged in.';
        if (user.pass !== (await hash(currentPassword))) return 'Current password is incorrect.';
        email = email.trim().toLowerCase();
        const users = await getUsers();
        if (users.some((u) => u.email === email && u.id !== user.id)) return 'That email is already in use.';
        if (newPassword) {
            const pwError = validatePassword(newPassword);
            if (pwError) return pwError;
        }
        const updated = {
            ...user, email, username: username.trim(),
            pass: newPassword ? await hash(newPassword) : user.pass,
        };
        await AsyncStorage.setItem('users', JSON.stringify(users.map((u) => (u.id === user.id ? updated : u))));
        setUser(updated);
        return null;
    };

    // FORGOT PASSWORD, step 1: create a one-time token and email a reset link.
    // If the email isn't registered we still return success, so nobody can use
    // this form to find out which emails have accounts.
    const requestPasswordReset = async (email: string): Promise<string | null> => {
        email = email.trim().toLowerCase();
        if (!email.includes('@')) return 'Enter a valid email address.';
        const found = (await getUsers()).find((u) => u.email === email);
        if (!found) return null;

        // Random one-time token (16 random bytes written as hex)
        const bytes = await Crypto.getRandomBytesAsync(16);
        const token = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');

        // Save only the token's hash, and drop old or expired requests for this email
        const kept = (await getResets()).filter((r) => r.email !== email && r.expires > Date.now());
        kept.push({ email, tokenHash: await hash(token), expires: Date.now() + RESET_MINUTES * 60000 });
        await AsyncStorage.setItem('resets', JSON.stringify(kept));

        // The link opens the reset-password screen inside the app
        const link = Linking.createURL('reset-password', { queryParams: { token, email } });
        try {
            await sendResetEmail(email, found.username, link, RESET_MINUTES);
        } catch {
            return 'We could not send the email. Please try again later.';
        }
        return null;
    };

    // FORGOT PASSWORD, step 2: check the token from the link and save the new password.
    const resetPassword = async (email: string, token: string, newPassword: string): Promise<string | null> => {
        const pwError = validatePassword(newPassword);
        if (pwError) return pwError;
        email = email.trim().toLowerCase();
        const tokenHash = await hash(token);
        const resets = await getResets();
        const valid = resets.find((r) => r.email === email && r.tokenHash === tokenHash && r.expires > Date.now());
        if (!valid) return 'This reset link is invalid or has expired.';

        const newPass = await hash(newPassword);
        const users = await getUsers();
        await AsyncStorage.setItem('users', JSON.stringify(users.map((u) => (u.email === email ? { ...u, pass: newPass } : u))));
        // The link can only be used once
        await AsyncStorage.setItem('resets', JSON.stringify(resets.filter((r) => r.email !== email)));
        return null;
    };

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout, updateProfile, requestPasswordReset, resetPassword }}>
            {children}
        </AuthContext.Provider>
    );
}