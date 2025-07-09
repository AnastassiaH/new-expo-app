import ErrorOverlay from '@/components/ui/ErrorOverlay';
import { useAuthStore } from '@/stores/authStore';
import { useAuthError } from '@/stores/errorStore';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
  const { session } = useAuthStore();
  const { error, clearError } = useAuthError()

  if (session) {
    return <Redirect href="/(app)/ride" />
  }

  return (
    <>
      <ErrorOverlay error={error} clearError={clearError} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="reset-password" />
        <Stack.Screen name="verification" />
      </Stack>
    </>
  );
}
