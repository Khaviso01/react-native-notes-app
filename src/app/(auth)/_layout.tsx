import { Stack } from 'expo-router';

// Stack navigator grouping unauthenticated login and registration screens without headers.
export default function AuthLayout() {
    // Hide default stack headers so login and register screens control their own layout
    return <Stack screenOptions={{ headerShown: false }} />;
}
