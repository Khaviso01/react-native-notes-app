import { useState } from 'react';
import { View, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from './AppText';
import { C, FONT } from '../theme';

// Which side of the input the eye icon sits on: 'left' or 'right'
const EYE_SIDE: 'left' | 'right' = 'right';

interface FieldProps extends TextInputProps {
  label?: string; // small label shown above the input
}

// A reusable dark text input with an optional label, used on every form.
// Password fields (secureTextEntry) get an eye icon to show or hide the password.
export default function Field({ label, ...props }: FieldProps) {
  const isPassword = !!props.secureTextEntry;
  const [hidden, setHidden] = useState(true); // true = dots, false = readable text

  return (
    <View>
      {!!label && <Text style={{ color: C.muted, fontSize: 13, marginBottom: 6 }}>{label}</Text>}
      <View style={{ marginBottom: 12 }}>
        <TextInput
          placeholderTextColor={C.muted}
          autoCapitalize="none"
          {...props}
          secureTextEntry={isPassword ? hidden : false}
          style={[
            {
              backgroundColor: C.surface, color: C.text, borderRadius: 14, padding: 16, fontSize: 16, fontFamily: FONT.regular,
              // Leave room for the eye icon on its side
              ...(isPassword ? { [EYE_SIDE === 'left' ? 'paddingLeft' : 'paddingRight']: 48 } : {}),
            },
            props.style,
          ]}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setHidden(!hidden)}
            hitSlop={10}
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            style={{ position: 'absolute', top: 0, bottom: 0, [EYE_SIDE]: 14, justifyContent: 'center' }}
          >
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={22} color={C.muted} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}