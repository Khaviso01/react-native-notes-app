import { View, TextInput, TextInputProps } from 'react-native';
import Text from './AppText';
import { C, FONT } from '../theme';

interface FieldProps extends TextInputProps {
  label?: string; // small label shown above the input
}

// A reusable dark text input with an optional label, used on every form.
export default function Field({ label, ...props }: FieldProps) {
  return (
    <View>
      {!!label && <Text style={{ color: C.muted, fontSize: 13, marginBottom: 6 }}>{label}</Text>}
      <TextInput
        placeholderTextColor={C.muted}
        autoCapitalize="none"
        {...props}
        style={[
          { backgroundColor: C.surface, color: C.text, borderRadius: 14, padding: 16, marginBottom: 12, fontSize: 16, fontFamily: FONT.regular },
          props.style,
        ]}
      />
    </View>
  );
}