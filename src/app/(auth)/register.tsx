import { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Link, Href } from 'expo-router';
import Text from '../../components/AppText';
import Field from '../../components/Field';
import { useAuth } from '../../context/AuthContext';
import { C, FONT } from '../../theme';

export default function Register() {
    const { register } = useAuth();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState(''); // the password typed a second time
    const [error, setError] = useState('');

    // Make sure both passwords match, then create the account.
    // On success the route guard moves us to the home screen.
    const submit = async () => {
        if (password !== confirm) return setError('Passwords do not match.');
        setError((await register(email, username, password)) || '');
    };

    return (
        <View style={{ flex: 1, backgroundColor: C.bg, padding: 24, justifyContent: 'center' }}>
            <Text style={{ color: C.text, fontSize: 32, fontWeight: '700', marginBottom: 6 }}>Create account</Text>
            <Text style={{ color: C.muted, marginBottom: 28 }}>Start keeping your notes in one place.</Text>
            <Field label="Username" placeholder="Username" value={username} onChangeText={setUsername} />
            <Field label="Email" placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
            <Field label="Password" placeholder="Password (6+ characters)" secureTextEntry value={password} onChangeText={setPassword} />
            <Field label="Confirm password" placeholder="Confirm password" secureTextEntry value={confirm} onChangeText={setConfirm} />
            {!!error && <Text style={{ color: C.danger, marginBottom: 10 }}>{error}</Text>}
            <TouchableOpacity onPress={submit} style={{ backgroundColor: C.accent, padding: 16, borderRadius: 14, alignItems: 'center' }}>
                <Text style={{ fontWeight: '700', fontSize: 16 }}>Sign up</Text>
            </TouchableOpacity>
            <Link href={'/login' as Href} style={{ color: C.text, textAlign: 'center', marginTop: 20, fontFamily: FONT.regular }}>
                Have an account? <Text style={{ color: C.accent }}>Log in</Text>
            </Link>
        </View>
    );
}