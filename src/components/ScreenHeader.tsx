import { ReactNode } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Text from './AppText';
import { C } from '../theme';

// Top bar for sub-screens: back arrow on the left, centred title, optional action on the right.
export default function ScreenHeader({ title, right }: { title: string; right?: ReactNode }) {
  const router = useRouter();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
      <TouchableOpacity onPress={() => router.back()} hitSlop={10} accessibilityLabel="Go back" style={{ width: 40 }}>
        <Ionicons name="chevron-back" size={26} color={C.text} />
      </TouchableOpacity>
      <Text style={{ color: C.text, fontSize: 18, fontWeight: '600' }}>{title}</Text>
      <View style={{ width: 40, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}