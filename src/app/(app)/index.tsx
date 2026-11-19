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

// / Home notes feed screen displaying the user's notes with search, category filtering, and sort direction controls.
export default function Home() {
  const { user } = useAuth();
  const { notes, deleteNote } = useNotes();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [newestFirst, setNewestFirst] = useState(true);

  
  // Filter by category + search, then sort by date added.
  const visible = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
     return notes
      .filter((n) => category === 'All' || n.category === category)
      // SEARCH: every typed word must appear somewhere in the title or text.
      .filter((n) => words.every((w) => `${n.title} ${n.text}`.toLowerCase().includes(w)))
      .sort((a, b) => (newestFirst ? b.createdAt - a.createdAt : a.createdAt - b.createdAt));
  }, [notes, query, category, newestFirst]);

  // Display a confirmation dialog before permanently deleting a note from the Home list.
  const confirmDelete = (n: Note) =>
    Alert.alert('Delete note?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteNote(n.id) },
    ]);

     return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg, paddingHorizontal: 20 }}>
      
    </SafeAreaView>
  );
}