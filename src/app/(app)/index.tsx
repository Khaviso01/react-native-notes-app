import { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useNotes } from '../../context/NotesContext';
import { C, CATEGORIES } from '../../theme';
import { Note } from '../../types';

// / Format epoch timestamps into a concise day-month-year string for note cards.
const fmt = (t: number) => new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });