import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import Field from '../../components/Field';
import { useAuth } from '../../context/AuthContext';
import { C } from '../../theme';

// Login screen component for authenticating existing user accounts.
export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const submit = async () => setError((await login(email, password)) || '');

  return (
    <View style={{ flex: 1, backgroundColor: C.bg, padding: 24, justifyContent: 'center' }}>
      <Text style={{ color: C.text, fontSize: 32, fontWeight: '700', marginBottom: 6 }}>Welcome back</Text>
      <Text style={{ color: C.muted, marginBottom: 28 }}>Log in to see your notes.</Text>
      <Field placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <Field placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      {!!error && <Text style={{ color: C.danger, marginBottom: 10 }}>{error}</Text>}
      <TouchableOpacity onPress={submit} style={{ backgroundColor: C.accent, padding: 16, borderRadius: 14, alignItems: 'center' }}>
        <Text style={{ fontWeight: '700', fontSize: 16 }}>Log in</Text>
      </TouchableOpacity>
      <Link href="/register" style={{ color: C.text, textAlign: 'center', marginTop: 20 }}>
        New here? <Text style={{ color: C.accent }}>Create an account</Text>
      </Link>
    </View>
  );
}