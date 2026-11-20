import { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Text from '../components/AppText';
import Field from '../components/Field';
import Avatar from '../components/Avatar';
import ScreenHeader from '../components/ScreenHeader';
import { useAuth } from '../context/AuthContext';
import { C } from '../theme';

// Edit Profile: change the username. The email is shown but cannot be edited.
export default function EditProfile() {
  const { user, updateProfile } = useAuth();
  const [username, setUsername] = useState(user?.username ?? '');
  const [currentPassword, setCurrent] = useState('');
  const [msg, setMsg] = useState({ text: '', ok: false });

  // Save the new username (the current password is required to confirm it's really the owner).
  const save = async () => {
    if (!username.trim()) return setMsg({ text: 'Username cannot be empty.', ok: false });
    const err = await updateProfile({ email: user?.email ?? '', username, currentPassword });
    setMsg(err ? { text: err, ok: false } : { text: 'Profile updated.', ok: true });
    if (!err) setCurrent('');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ padding: 24, alignItems: 'center' }} keyboardShouldPersistTaps="handled">
        {/* Centred column: full width on phones, capped on wide screens */}
        <View style={{ width: '100%', maxWidth: 480 }}>
          <ScreenHeader
            title="Edit Profile"
            right={
              <TouchableOpacity onPress={save} hitSlop={10} accessibilityLabel="Save changes">
                <Ionicons name="checkmark" size={26} color={C.accent} />
              </TouchableOpacity>
            }
          />

          <View style={{ alignItems: 'center', marginBottom: 28 }}>
            <Avatar name={username || user?.username || ''} size={88} />
          </View>

          <Text style={{ color: C.text, fontSize: 18, fontWeight: '600', marginBottom: 14 }}>Your Information</Text>
          {/* Email is read-only: shown dimmed and cannot be edited */}
          <Field label="Email" value={user?.email ?? ''} editable={false} style={{ opacity: 0.6 }} />
          <Text style={{ color: C.muted, fontSize: 12, marginTop: -6, marginBottom: 14 }}>Your email can't be changed.</Text>
          <Field label="Username" placeholder="Username" value={username} onChangeText={setUsername} />
          <Field label="Current password" placeholder="Current password (required)" secureTextEntry value={currentPassword} onChangeText={setCurrent} />

          {!!msg.text && <Text style={{ color: msg.ok ? C.accent : C.danger, marginBottom: 10 }}>{msg.text}</Text>}
          <TouchableOpacity onPress={save} style={{ backgroundColor: C.accent, padding: 16, borderRadius: 14, alignItems: 'center', marginTop: 4 }}>
            <Text style={{ fontWeight: '700', fontSize: 16 }}>Save changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}