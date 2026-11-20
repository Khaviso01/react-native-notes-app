import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../../theme';

// Bottom bar: Home (house icon), "+" (opens the note editor), Profile (person icon).
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
      {/* Left: Home screen (src/app/(app)/index.tsx) */}
      <Tabs.Screen
        name="index"
        options={{ tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color as string} /> }}
      />

      {/* Middle: "+" never shows a page, it opens the note editor instead */}
      <Tabs.Screen
        name="add"
        options={{ tabBarIcon: () => <Ionicons name="add-circle" size={40} color={C.accent} /> }}
        listeners={{ tabPress: (e) => { e.preventDefault(); router.push('/note'); } }}
      />

      {/* Right: Profile screen (src/app/(app)/profile.tsx) */}
      <Tabs.Screen
        name="profile"
        options={{ tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color as string} /> }}
      />
    </Tabs>
  );
}