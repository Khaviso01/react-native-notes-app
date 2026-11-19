import { useState } from 'react';
import { TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../../components/AppText';
import Field from '../../components/Field';
import { useAuth } from '../../context/AuthContext';
import { C } from '../../theme';

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const [email, setEmail] = useState(user?.email ?? '');
  const [username, setUsername] = useState(user?.username ?? '');
  const [currentPassword, setCurrent] = useState('');
  const [newPassword, setNew] = useState('');
  const [msg, setMsg] = useState({ text: '', ok: false });

  // Save new credentials (needs the current password to confirm it's really the owner).
  const save = async () => {
    const err = await updateProfile({ email, username, currentPassword, newPassword });
    setMsg(err ? { text: err, ok: false } : { text: 'Profile updated.', ok: true });
    if (!err) { setCurrent(''); setNew(''); }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text style={{ color: C.text, fontSize: 26, fontWeight: '700', marginBottom: 20 }}>Your profile</Text>
        <Field label="Email" placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
        <Field label="Username" placeholder="Username" value={username} onChangeText={setUsername} />
        <Field label="New password" placeholder="New password (leave blank to keep)" secureTextEntry value={newPassword} onChangeText={setNew} />
        <Field label="Current password" placeholder="Current password (required)" secureTextEntry value={currentPassword} onChangeText={setCurrent} />
        {!!msg.text && <Text style={{ color: msg.ok ? C.accent : C.danger, marginBottom: 10 }}>{msg.text}</Text>}
        <TouchableOpacity onPress={save} style={{ backgroundColor: C.accent, padding: 16, borderRadius: 14, alignItems: 'center' }}>
          <Text style={{ fontWeight: '700', fontSize: 16 }}>Save changes</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={logout} style={{ padding: 16, alignItems: 'center', marginTop: 8 }}>
          <Text style={{ color: C.text }}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}