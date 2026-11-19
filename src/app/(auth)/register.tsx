import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import Field from '../../components/Field';
import { useAuth } from '../../context/AuthContext';
import { C } from '../../theme';

// Registration screen component for creating a new local user account.
export default function Register() {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // Create the account; on success the route guard moves us to the home screen.
  const submit = async () => setError((await register(email, username, password)) || '');

  // Render dark-themed registration UI with email, username, password fields, error feedback, and login link
  return (
    <View style={{ flex: 1, backgroundColor: C.bg, padding: 24, justifyContent: 'center' }}>
      <Text style={{ color: C.text, fontSize: 32, fontWeight: '700', marginBottom: 6 }}>Create account</Text>
      <Text style={{ color: C.muted, marginBottom: 28 }}>Start keeping your notes in one place.</Text>
      <Field placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <Field placeholder="Username" value={username} onChangeText={setUsername} />
      <Field placeholder="Password (6+ characters)" secureTextEntry value={password} onChangeText={setPassword} />
      {!!error && <Text style={{ color: C.danger, marginBottom: 10 }}>{error}</Text>}
      <TouchableOpacity onPress={submit} style={{ backgroundColor: C.accent, padding: 16, borderRadius: 14, alignItems: 'center' }}>
        <Text style={{ fontWeight: '700', fontSize: 16 }}>Sign up</Text>
      </TouchableOpacity>
      <Link href="/login" style={{ color: C.text, textAlign: 'center', marginTop: 20 }}>
        Have an account? <Text style={{ color: C.accent }}>Log in</Text>
      </Link>
    </View>
  );
}