import { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Text from '../components/AppText';
import Field from '../components/Field';
import ScreenHeader from '../components/ScreenHeader';
import DeleteNoteModal from '../components/DeleteNoteModal';
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
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false); // is the delete confirmation showing?

  // Go back to the previous screen (the home screen), or to home if there is no history
  const goHome = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const save = () => {
    if (!text.trim()) return setError('Write something before saving.');
    const data = { title: title.trim(), text: text.trim(), category };
    existing ? updateNote(existing.id, data) : addNote(data);
    goHome();
  };

  // Called when the user presses OK in the delete modal
  const remove = () => {
    if (!existing) return;
    deleteNote(existing.id);
    setConfirmDelete(false);
    goHome();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ padding: 24, alignItems: 'center' }} keyboardShouldPersistTaps="handled">
        {/* Centred column: full width on phones, capped on wide screens */}
        <View style={{ width: '100%', maxWidth: 560 }}>
          {/* Back arrow on the left, title in the middle, bin icon on the right (only when editing) */}
          <ScreenHeader
            title={existing ? 'Edit note' : 'New note'}
            right={
              existing ? (
                <TouchableOpacity onPress={() => setConfirmDelete(true)} hitSlop={10} accessibilityLabel="Delete note">
                  <Ionicons name="trash-outline" size={24} color={C.danger} />
                </TouchableOpacity>
              ) : undefined
            }
          />

          <Field label="Title" placeholder="Title (optional)" value={title} onChangeText={setTitle} autoCapitalize="sentences" />
          <Field label="Note" placeholder="Write your note..." value={text} onChangeText={(t) => { setText(t); setError(''); }} multiline autoCapitalize="sentences"
            style={{ minHeight: 160, textAlignVertical: 'top' }} />

          {/* Category picker */}
          <Text style={{ color: C.muted, fontSize: 13, marginBottom: 6 }}>Category</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {CATEGORIES.map((c) => (
              <TouchableOpacity key={c} onPress={() => setCategory(c)}
                style={{ paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, backgroundColor: category === c ? C.accent : C.surface }}>
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

          {!!error && <Text style={{ color: C.danger, marginBottom: 10 }}>{error}</Text>}
          <TouchableOpacity onPress={save} style={{ backgroundColor: C.accent, padding: 16, borderRadius: 14, alignItems: 'center' }}>
            <Text style={{ fontWeight: '700', fontSize: 16 }}>{existing ? 'Save changes' : 'Add note'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Confirmation: "Deleted notes are permanently removed." with Cancel and OK */}
      <DeleteNoteModal visible={confirmDelete} onCancel={() => setConfirmDelete(false)} onConfirm={remove} />
    </SafeAreaView>
  );
}