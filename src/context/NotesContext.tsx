import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { Note, NoteInput } from '../types';

// // Shape of the notes context value exposing CRUD operations and active user notes.
interface NotesCtx {
  notes: Note[];
  addNote: (data: NoteInput) => void;
  updateNote: (id: string, changes: Partial<NoteInput>) => void;
  deleteNote: (id: string) => void;
}
const NotesContext = createContext<NotesCtx | null>(null);
// Hook for screens; throws a clear error if used outside <NotesProvider>.
export const useNotes = (): NotesCtx => {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used inside NotesProvider');
  return ctx;
};