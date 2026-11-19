import { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Link, Href } from 'expo-router';
import Text from '../../components/AppText';
import Field from '../../components/Field';
import { useAuth } from '../../context/AuthContext';
import { C, FONT } from '../../theme';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Try to log in; show the error message if it fails.
  const submit = async () => setError((await login(email, password)) || '');

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, padding: 24, justifyContent: 'center' }}>
      <Text style={{ color: C.text, fontSize: 32, fontWeight: '700', marginBottom: 6 }}>Welcome back</Text>
      <Text style={{ color: C.muted, marginBottom: 28 }}>Log in to see your notes.</Text>
      <Field label="Email" placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <Field label="Password" placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      {/* Opens the forgot-password screen */}
      <Link href={'/forgot-password' as Href} style={{ color: C.accent, textAlign: 'right', marginBottom: 14, fontFamily: FONT.regular }}>
        Forgot password?
      </Link>
      {!!error && <Text style={{ color: C.danger, marginBottom: 10 }}>{error}</Text>}
      <TouchableOpacity onPress={submit} style={{ backgroundColor: C.accent, padding: 16, borderRadius: 14, alignItems: 'center' }}>
        <Text style={{ fontWeight: '700', fontSize: 16 }}>Log in</Text>
      </TouchableOpacity>
      <Link href={'/register' as Href} style={{ color: C.text, textAlign: 'center', marginTop: 20, fontFamily: FONT.regular }}>
        New here? <Text style={{ color: C.accent }}>Create an account</Text>
      </Link>
    </View>
  );
}