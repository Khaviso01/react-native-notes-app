import { View } from 'react-native';
import Text from './AppText';
import { C } from '../theme';

// Round avatar showing the first letter of the user's name, in the app's yellow.
export default function Avatar({ name, size = 96 }: { name: string; size?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#000', fontSize: size * 0.4, fontWeight: '700' }}>{(name || '?').charAt(0).toUpperCase()}</Text>
    </View>
  );
}