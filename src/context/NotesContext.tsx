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

export function NotesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [all, setAll] = useState<Note[]>([]); // every note from every user (stored together)

  // Load notes from storage once the app starts.
  useEffect(() => {
    AsyncStorage.getItem('notes').then((v) => setAll(JSON.parse(v || '[]')));
  }, []);

  // Save helper: updates state and AsyncStorage together.
  const save = (list: Note[]) => {
    setAll(list);
    AsyncStorage.setItem('notes', JSON.stringify(list));
  };

  // READ: only the notes that belong to the logged-in user.
  const notes = all.filter((n) => n.userId === user?.id);

  // CREATE: new note with the date it was added.
  const addNote = ({ title, text, category }: NoteInput) =>
    save([...all, { id: Date.now().toString(), userId: user!.id, title, text, category, createdAt: Date.now(), editedAt: null }]);

  // UPDATE: change fields and record the edit timestamp.
  const updateNote = (id: string, changes: Partial<NoteInput>) =>
    save(all.map((n) => (n.id === id ? { ...n, ...changes, editedAt: Date.now() } : n)));

  // DELETE: remove the note.
  const deleteNote = (id: string) => save(all.filter((n) => n.id !== id));

  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote }}>{children}</NotesContext.Provider>
  );
}
