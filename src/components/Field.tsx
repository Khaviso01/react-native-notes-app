import { TextInput, TextInputProps } from 'react-native';
import { C, FONT } from '../theme';

// A reusable dark text input used by login, register, profile and note screens.
export default function Field(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={C.muted}
      autoCapitalize="none"
      {...props}
      style={[{ backgroundColor: C.surface, color: C.text, borderRadius: 14, padding: 16, marginBottom: 12, fontSize: 16, fontFamily: FONT.regular }, props.style]}
    />
  );
}