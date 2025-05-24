import { useAuthStore } from '@/stores/authStore';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
  const { session } = useAuthStore();

  if (session) {
    return <Redirect href="/(app)/ride" />
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="reset-password" />
      <Stack.Screen name="verification" />
    </Stack>
  );
}
