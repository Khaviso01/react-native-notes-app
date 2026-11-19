import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { NotesProvider } from '../context/NotesContext';
import { C } from '../theme';

// Route guard component that redirects unauthenticated users to /login and authenticated users
function Guard() {
    const { user, loading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    // Evaluate route access whenever auth state, loading state, or active route segments change.
    useEffect(() => {
        if (loading) return;
        // Check whether the current route belongs to the unauthenticated (auth) group.
        const inAuthPages = segments[0] === '(auth)';
        if (!user && !inAuthPages) router.replace('/login');
        else if (user && inAuthPages) router.replace('/');
    }, [user, loading, segments]);

    return (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.bg } }}>
            <Stack.Screen name="note" options={{ presentation: 'modal' }} />
        </Stack>
    );
}