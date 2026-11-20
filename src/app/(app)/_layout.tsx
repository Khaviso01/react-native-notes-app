import { useState, useRef } from 'react';
import { View, Pressable } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Text from '../../components/AppText';
import { C } from '../../theme';

// Wraps a bottom-bar icon and shows a small text label:
// - on web: while the mouse hovers over the icon
// - on phones: for a moment after a long press
function TabButton({ label, ...props }: any) {
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Long press (phones): show the label, then hide it after 1.5 seconds
  const flash = () => {
    setShow(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setShow(false), 1500);
  };

  return (
    <Pressable
      // The navigation props keep tapping working exactly as before
      onPress={props.onPress}
      onLongPress={(e) => { flash(); props.onLongPress?.(e); }}
      onHoverIn={() => setShow(true)}   // mouse enters (web)
      onHoverOut={() => setShow(false)} // mouse leaves (web)
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={props.accessibilityState}
      testID={props.testID}
      style={[props.style, { alignItems: 'center', justifyContent: 'center' }]}
    >
      {props.children}

      {/* The tooltip: floats just above the icon and never blocks taps */}
      {show && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            bottom: 66,
            backgroundColor: C.surface,
            borderWidth: 1,
            borderColor: '#3A3B3A',
            borderRadius: 8,
            paddingVertical: 5,
            paddingHorizontal: 10,
            zIndex: 10,
          }}
        >
          <Text style={{ color: C.text, fontSize: 12 }}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

// Bottom bar: Home (house icon), "+" (opens the note editor), Profile (person icon).
// Hovering an icon (web) or long-pressing it (phone) shows its name.
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
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color as string} />,
          tabBarButton: (props) => <TabButton {...props} label="Home" />,
        }}
      />

      {/* Middle: "+" never shows a page, it opens the note editor instead */}
      <Tabs.Screen
        name="add"
        options={{
          tabBarIcon: () => <Ionicons name="add-circle" size={40} color={C.accent} />,
          tabBarButton: (props) => <TabButton {...props} label="Add note" />,
        }}
        listeners={{ tabPress: (e) => { e.preventDefault(); router.push('/note'); } }}
      />

      {/* Right: Profile screen (src/app/(app)/profile.tsx) */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color as string} />,
          tabBarButton: (props) => <TabButton {...props} label="Profile" />,
        }}
      />
    </Tabs>
  );
}