import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { NotesProvider } from '../context/NotesContext';
import { C } from '../theme';

// Route guard helper inspecting authentication status and expo router
function Guard() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Redirect unauthentication users to /Login and authenticated users away from auth
   useEffect(() => {
    if (loading) return;
    const inAuthPages = segments[0] === '(auth)';
    // send guests to login screen or else redirect to main screen
    if (!user && !inAuthPages) router.replace('/login');
    else if (user && inAuthPages) router.replace('/');
  }, [user, loading, segments]);