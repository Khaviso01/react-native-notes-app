import { Text, TextProps, StyleSheet, TextStyle } from 'react-native';
import { FONT } from '../theme';

// fontWeight value to the matching Geist font file.
function fontFor(weight?: TextStyle['fontWeight']) {
  switch (String(weight)) {
    case '700': case 'bold': case '800': case '900': return FONT.bold;
    case '600': return FONT.semibold;
    case '500': return FONT.medium;
    default: return FONT.regular;
  }
}

export default function AppText({ style, ...rest }: TextProps) {
  const flat = StyleSheet.flatten(style) || {};
  // fontWeight is reset to normal so Android doesn't fake-bold the font a second time.
  return <Text {...rest} style={[flat, { fontFamily: fontFor(flat.fontWeight), fontWeight: 'normal' }]} />;
}