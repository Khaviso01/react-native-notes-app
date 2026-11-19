import { useState } from 'react';
import { View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Text from '../components/AppText';
import Field from '../components/Field';
import { useNotes } from '../context/NotesContext';
import { C, CATEGORIES } from '../theme';

// One screen for both ADDING (no id) and EDITING (id passed from the home screen).
export default function NoteScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { notes, addNote, updateNote, deleteNote } = useNotes();
  const existing = notes.find((n) => n.id === id);

  const [title, setTitle] = useState(existing?.title || '');
  const [text, setText] = useState(existing?.text || '');
  const [category, setCategory] = useState(existing?.category || CATEGORIES[0]);

  const save = () => {
    if (!text.trim()) return Alert.alert('Note is empty', 'Write something before saving.');
    const data = { title: title.trim(), text: text.trim(), category };
    existing ? updateNote(existing.id, data) : addNote(data);
    router.back();
  };

  // Delete the note being edited (only possible when editing, not when adding)
  const remove = () => {
    if (!existing) return;
    Alert.alert('Delete note?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { deleteNote(existing.id); router.back(); } },
    ]);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 24 }}>
      <Text style={{ color: C.text, fontSize: 26, fontWeight: '700', marginBottom: 16 }}>{existing ? 'Edit note' : 'New note'}</Text>
      <Field label="Title" placeholder="Title (optional)" value={title} onChangeText={setTitle} autoCapitalize="sentences" />
      <Field label="Note" placeholder="Write your note..." value={text} onChangeText={setText} multiline autoCapitalize="sentences"
        style={{ minHeight: 160, textAlignVertical: 'top' }} />

      {/* Category picker */}
      <Text style={{ color: C.muted, fontSize: 13, marginBottom: 6 }}>Category</Text>
      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity key={c} onPress={() => setCategory(c)}
            style={{ paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, marginRight: 8, backgroundColor: category === c ? C.accent : C.surface }}>
            <Text style={{ color: category === c ? '#000' : C.text }}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {existing && (
        <Text style={{ color: C.muted, marginBottom: 16 }}>
          Added {new Date(existing.createdAt).toLocaleString()}
          {existing.editedAt ? `\nLast edited ${new Date(existing.editedAt).toLocaleString()}` : ''}
        </Text>
      )}

      <TouchableOpacity onPress={save} style={{ backgroundColor: C.accent, padding: 16, borderRadius: 14, alignItems: 'center' }}>
        <Text style={{ fontWeight: '700', fontSize: 16 }}>{existing ? 'Save changes' : 'Add note'}</Text>
      </TouchableOpacity>
      {existing && (
        <TouchableOpacity onPress={remove} style={{ padding: 16, alignItems: 'center' }}>
          <Text style={{ color: C.danger }}>Delete note</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}