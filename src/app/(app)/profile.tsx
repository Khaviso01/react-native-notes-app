import { useState, ComponentProps } from 'react';
import { View, TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';
import Constants from 'expo-constants';
import Text from '../../components/AppText';
import Avatar from '../../components/Avatar';
import { useAuth } from '../../context/AuthContext';
import { useNotes } from '../../context/NotesContext';
import { C, CATEGORIES } from '../../theme';

const DIVIDER = '#3A3B3A'; // thin line between rows

// One tappable menu row: icon, label and a chevron on the right.
function Row({ icon, label, onPress, iconColor = C.text, last = false }: {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
  iconColor?: string;
  last?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 16, borderBottomWidth: last ? 0 : 1, borderBottomColor: DIVIDER }}
    >
      <Ionicons name={icon} size={20} color={iconColor} />
      <Text style={{ color: C.text, fontSize: 16, marginLeft: 14, flex: 1 }}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={C.muted} />
    </TouchableOpacity>
  );
}

export default function Profile() {
  const { user, logout } = useAuth();
  const { notes } = useNotes();
  const router = useRouter();
  const [confirmLogout, setConfirmLogout] = useState(false); // is the logout confirmation showing?

  // Numbers for the stats strip: total notes, then one count per category
  const stats = [
    { label: 'Total', value: notes.length },
    ...CATEGORIES.map((c) => ({ label: c, value: notes.filter((n) => n.category === c).length })),
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg, paddingTop: 28 }}>
      <ScrollView contentContainerStyle={{ padding: 24, alignItems: 'center' }}>
        {/* Centred column: full width on phones, capped on wide screens */}
        <View style={{ width: '100%', maxWidth: 520 }}>

          {/* Avatar + name + email + Edit Profile button */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
            <Avatar name={user?.username ?? ''} size={96} />
            <View style={{ flex: 1, minWidth: 0, marginLeft: 18 }}>
              <Text style={{ color: C.text, fontSize: 20, fontWeight: '700' }} numberOfLines={1}>{user?.username}</Text>
              <Text style={{ color: C.muted, marginTop: 2, marginBottom: 12 }} numberOfLines={1}>{user?.email}</Text>
            </View>
          </View>

          {/* Stats strip: how many notes the user has */}
          <View style={{ flexDirection: 'row', backgroundColor: C.surface, borderRadius: 18, paddingVertical: 16, marginBottom: 16 }}>
            {stats.map((s, i) => (
              <View key={s.label} style={{ flex: 1, alignItems: 'center', borderLeftWidth: i === 0 ? 0 : 1, borderLeftColor: DIVIDER }}>
                <Text style={{ color: C.accent, fontSize: 22, fontWeight: '700' }}>{s.value}</Text>
                <Text style={{ color: C.muted, fontSize: 12, marginTop: 2 }} numberOfLines={1}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* Group 1: account */}
          <View style={{ backgroundColor: C.surface, borderRadius: 18, marginBottom: 16, overflow: 'hidden' }}>
            <Row icon="person-outline" label="Edit profile" onPress={() => router.push('/edit-profile' as Href)} />
            <Row icon="lock-closed-outline" label="Change password" onPress={() => router.push('/change-password' as Href)} last />
          </View>

          {/* Group 2: log out (opens a confirmation first) */}
          <View style={{ backgroundColor: C.surface, borderRadius: 18, overflow: 'hidden' }}>
            <Row icon="log-out-outline" iconColor={C.danger} label="Log out" onPress={() => setConfirmLogout(true)} last />
          </View>

          <Text style={{ color: C.muted, fontSize: 12, textAlign: 'center', marginTop: 28 }}>
            App version {Constants.expoConfig?.version ?? '3.0.0'}
          </Text>
        </View>
      </ScrollView>

      {/* Logout confirmation modal */}
      <Modal visible={confirmLogout} transparent animationType="fade" statusBarTranslucent onRequestClose={() => setConfirmLogout(false)}>
        {/* Dark overlay: tapping outside the card closes the modal */}
        <Pressable
          onPress={() => setConfirmLogout(false)}
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 }}
        >
          {/* Card: full width on phones, capped on bigger screens. Inner Pressable keeps taps inside from closing it. */}
          <Pressable onPress={() => {}} style={{ width: '100%', maxWidth: 340, backgroundColor: C.surface, borderRadius: 20, padding: 24 }}>
            <Text style={{ color: C.text, fontSize: 20, fontWeight: '700', marginBottom: 8 }}>Log out?</Text>
            <Text style={{ color: C.muted, marginBottom: 24 }}>Are you sure you want to log out of your account?</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={() => setConfirmLogout(false)}
                style={{ flex: 1, padding: 14, borderRadius: 14, alignItems: 'center', backgroundColor: C.bg }}
              >
                <Text style={{ color: C.text, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setConfirmLogout(false); logout(); }}
                style={{ flex: 1, padding: 14, borderRadius: 14, alignItems: 'center', backgroundColor: C.accent }}
              >
                <Text style={{ fontWeight: '700' }}>Log out</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}