import { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { C } from '../theme';

// Maximum width of the form. Make this number smaller for a narrower form.
const MAX_FORM_WIDTH = 380;

// Shared wrapper for the login, register, forgot-password and reset-password screens.
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.bg }}
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ width: '100%', maxWidth: MAX_FORM_WIDTH }}>{children}</View>
    </ScrollView>
  );
}