import { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Link, Href, useLocalSearchParams } from 'expo-router';
import Text from '../../components/AppText';
import Field from '../../components/Field';
import { useAuth } from '../../context/AuthContext';
import { C, FONT } from '../../theme';

// Step 2 of resetting a password. The email link opens this screen and
// passes the one-time token and the email in the link.
export default function ResetPassword() {
  const { token, email } = useLocalSearchParams<{ token?: string; email?: string }>();
  const { resetPassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (!token || !email) return setError('This reset link is invalid.');
    if (password !== confirm) return setError('Passwords do not match.');
    const err = await resetPassword(email, token, password);
    setError(err || '');
    setDone(!err);
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, padding: 24, justifyContent: 'center' }}>
      <Text style={{ color: C.text, fontSize: 32, fontWeight: '700', marginBottom: 6 }}>Reset password</Text>
      <Text style={{ color: C.muted, marginBottom: 28 }}>Choose a new password for your account.</Text>
      {done ? (
        <>
          <Text style={{ color: C.accent, marginBottom: 20 }}>Your password has been updated. You can log in now.</Text>
          <Link href={'/login' as Href} style={{ color: C.text, textAlign: 'center', fontFamily: FONT.regular }}>
            Go to <Text style={{ color: C.accent }}>Log in</Text>
          </Link>
        </>
      ) : (
        <>
          <Field label="New password" placeholder="New password (6+ characters)" secureTextEntry value={password} onChangeText={setPassword} />
          <Field label="Confirm new password" placeholder="Confirm new password" secureTextEntry value={confirm} onChangeText={setConfirm} />
          {!!error && <Text style={{ color: C.danger, marginBottom: 10 }}>{error}</Text>}
          <TouchableOpacity onPress={submit} style={{ backgroundColor: C.accent, padding: 16, borderRadius: 14, alignItems: 'center' }}>
            <Text style={{ fontWeight: '700', fontSize: 16 }}>Reset password</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}