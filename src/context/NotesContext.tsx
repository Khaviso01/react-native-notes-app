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