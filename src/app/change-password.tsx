import { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../components/AppText';
import Field from '../components/Field';
import ScreenHeader from '../components/ScreenHeader';
import { useAuth } from '../context/AuthContext';
import { C } from '../theme';

// Change Password: its own screen with a header, new password + confirmation, and the current password.
export default function ChangePassword() {
  const { user, updateProfile } = useAuth();
  const [newPassword, setNew] = useState('');
  const [confirm, setConfirm] = useState('');
  const [currentPassword, setCurrent] = useState('');
  const [msg, setMsg] = useState({ text: '', ok: false });

  const save = async () => {
    if (!newPassword) return setMsg({ text: 'Enter a new password.', ok: false });
    if (newPassword !== confirm) return setMsg({ text: 'Passwords do not match.', ok: false });
    // Email and username are sent back unchanged; only the password changes
    const err = await updateProfile({
      email: user?.email ?? '', username: user?.username ?? '', currentPassword, newPassword,
    });
    setMsg(err ? { text: err, ok: false } : { text: 'Password updated.', ok: true });
    if (!err) { setNew(''); setConfirm(''); setCurrent(''); }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ padding: 24, alignItems: 'center' }} keyboardShouldPersistTaps="handled">
        <View style={{ width: '100%', maxWidth: 480 }}>
          <ScreenHeader title="Change Password" />
          <Text style={{ color: C.text, fontSize: 18, fontWeight: '600', marginBottom: 14 }}>New Password</Text>
          <Field label="New password" placeholder="New password (6+ characters, 1 special)" secureTextEntry value={newPassword} onChangeText={setNew} />
          <Field label="Confirm new password" placeholder="Confirm new password" secureTextEntry value={confirm} onChangeText={setConfirm} />
          <Field label="Current password" placeholder="Current password (required)" secureTextEntry value={currentPassword} onChangeText={setCurrent} />

          {!!msg.text && <Text style={{ color: msg.ok ? C.accent : C.danger, marginBottom: 10 }}>{msg.text}</Text>}
          <TouchableOpacity onPress={save} style={{ backgroundColor: C.accent, padding: 16, borderRadius: 14, alignItems: 'center', marginTop: 4 }}>
            <Text style={{ fontWeight: '700', fontSize: 16 }}>Update password</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}