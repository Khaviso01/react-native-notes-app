import { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Link, Href } from 'expo-router';
import Text from '../../components/AppText';
import Field from '../../components/Field';
import { useAuth } from '../../context/AuthContext';
import { C, FONT } from '../../theme';

// Step 1 of resetting a password: ask for the email and send a reset link.
export default function ForgotPassword() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    const err = await requestPasswordReset(email);
    setBusy(false);
    setError(err || '');
    setSent(!err);
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, padding: 24, justifyContent: 'center' }}>
      <Text style={{ color: C.text, fontSize: 32, fontWeight: '700', marginBottom: 6 }}>Forgot password?</Text>
      <Text style={{ color: C.muted, marginBottom: 28 }}>Enter your email and we'll send you a link to reset it.</Text>
      <Field label="Email" placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
      {!!error && <Text style={{ color: C.danger, marginBottom: 10 }}>{error}</Text>}
      {sent && (
        <Text style={{ color: C.accent, marginBottom: 10 }}>
          If an account exists for that email, a reset link is on its way. Check your inbox.
        </Text>
      )}
      <TouchableOpacity onPress={submit} disabled={busy} style={{ backgroundColor: C.accent, padding: 16, borderRadius: 14, alignItems: 'center', opacity: busy ? 0.6 : 1 }}>
        <Text style={{ fontWeight: '700', fontSize: 16 }}>{busy ? 'Sending...' : 'Send reset link'}</Text>
      </TouchableOpacity>
      <Link href={'/login' as Href} style={{ color: C.text, textAlign: 'center', marginTop: 20, fontFamily: FONT.regular }}>
        Back to <Text style={{ color: C.accent }}>Log in</Text>
      </Link>
    </View>
  );
}