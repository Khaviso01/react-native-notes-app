import { useState } from 'react';
import { Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Field from '../../components/Field';
import { useAuth } from '../../context/AuthContext';
import { C } from '../../theme';

// Profile screen component allowing the authenticated user to update account details, rotate passwords, or sign out
export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const [email, setEmail] = useState(user!.email);
  const [username, setUsername] = useState(user!.username);
  const [currentPassword, setCurrent] = useState('');
  const [newPassword, setNew] = useState('');
  const [msg, setMsg] = useState({ text: '', ok: false });

  // Save new credentials
  const save = async () => {
    const err = await updateProfile({ email, username, currentPassword, newPassword });
    setMsg(err ? { text: err, ok: false } : { text: 'Profile updated.', ok: true });
    if (!err) { setCurrent(''); setNew(''); }
  };