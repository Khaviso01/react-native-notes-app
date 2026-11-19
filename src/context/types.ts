export interface Note {
  id: string;
  userId: string;          // which user owns the note
  title: string;           // optional, may be empty
  text: string;
  category: string;
  createdAt: number;       // timestamp (ms) when added
  editedAt: number | null; // timestamp (ms) of last edit, or null if never edited
}
// What the add/edit screen provides (the rest is filled in automatically)
export type NoteInput = Pick<Note, 'title' | 'text' | 'category'>;