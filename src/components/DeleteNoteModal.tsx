import { View, TouchableOpacity, Modal, Pressable } from 'react-native';
import Text from './AppText';
import { C } from '../theme';

// Confirmation shown before a note is deleted. Used on the note screen and on the home screen.
// (Alert.alert does nothing on web, so this custom modal is used everywhere instead.)
export default function DeleteNoteModal({ visible, onCancel, onConfirm }: {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onCancel}>
      {/* Dark overlay: tapping outside the card closes the modal */}
      <Pressable onPress={onCancel} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        {/* Card: full width on phones, capped on bigger screens. The inner Pressable keeps taps inside from closing it. */}
        <Pressable onPress={() => {}} style={{ width: '100%', maxWidth: 340, backgroundColor: C.surface, borderRadius: 20, padding: 24 }}>
          <Text style={{ color: C.text, fontSize: 20, fontWeight: '700', marginBottom: 8 }}>Delete note?</Text>
          <Text style={{ color: C.muted, marginBottom: 24 }}>Deleted notes are permanently removed.</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity onPress={onCancel} style={{ flex: 1, padding: 14, borderRadius: 14, alignItems: 'center', backgroundColor: C.bg }}>
              <Text style={{ color: C.text, fontWeight: '600' }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} style={{ flex: 1, padding: 14, borderRadius: 14, alignItems: 'center', backgroundColor: C.danger }}>
              <Text style={{ fontWeight: '700' }}>OK</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}