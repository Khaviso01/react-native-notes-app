import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { Note, NoteInput } from '../types';

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
  
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.bg } }}>
      <Stack.Screen name="note" options={{ presentation: 'modal' }} />
    </Stack>
  );
}