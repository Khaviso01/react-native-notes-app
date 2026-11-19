import { useEffect } from 'react';
import { Stack, useRouter, useSegments, Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { NotesProvider } from '../context/NotesContext';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Geist_400Regular, Geist_500Medium, Geist_600SemiBold, Geist_700Bold } from '@expo-google-fonts/geist';
import { C } from '../theme';

// Keep splash screen visible
SplashScreen.preventAutoHideAsync();

// Route guard component that redirects unauthenticated users to /login and authenticated users
function Guard() {
    const { user, loading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    // Evaluate route access whenever auth state, loading state, or active route segments change.
    useEffect(() => {
        if (loading) return;
        // Compare as a plain string so TypeScript doesn't depend on the generated route list
        const inAuthPages = (segments[0] as string) === '(auth)';
        if (!user && !inAuthPages) router.replace('/login' as Href);
        else if (user && inAuthPages) router.replace('/');
    }, [user, loading, segments]);

    return (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.bg } }}>
            <Stack.Screen name="note" options={{ presentation: 'modal' }} />
        </Stack>
    );
}

// Providers make user + notes data available to every screen.
export default function Root() {
  const [fontsLoaded] = useFonts({ Geist_400Regular, Geist_500Medium, Geist_600SemiBold, Geist_700Bold });

  // Hide the splash screen once Geist has loaded
  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null; // wait for the font before showing anything

  return (
    <AuthProvider>
      <NotesProvider>
        <StatusBar style="light" />
        <Guard />
      </NotesProvider>
    </AuthProvider>
  );
}
