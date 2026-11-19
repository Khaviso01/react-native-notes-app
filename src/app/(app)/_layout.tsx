import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../../theme';

// Bottom tab navigator component configuring primary application tab
export default function AppTabs() {
  const router = useRouter();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: C.accent,
        tabBarInactiveTintColor: C.muted,
        tabBarStyle: { backgroundColor: C.bg, borderTopWidth: 0, height: 70 },
      }}
    >
      <Tabs.Screen name="index" options={{ tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} /> }} />
      <Tabs.Screen
        name="add"
        options={{ tabBarIcon: () => <Ionicons name="add-circle" size={40} color={C.accent} /> }}
        // Instead of showing a tab page, open the note editor.
        listeners={{ tabPress: (e) => { e.preventDefault(); router.push('/note'); } }}
      />
      <Tabs.Screen name="profile" options={{ tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} /> }} />
    </Tabs>
  );
}