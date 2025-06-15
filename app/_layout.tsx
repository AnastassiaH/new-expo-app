import { useLocationStore } from '@/stores/locationStore';
import { useFonts } from 'expo-font';
import 'react-native-get-random-values';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuthStore } from '@/stores/authStore';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { type ErrorBoundaryProps } from 'expo-router';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "black" }}>
      <Text style={{ color: "white" }}>{error.message}</Text>
      <Text style={{ color: "white" }} onPress={retry}>Try Again?</Text>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { session, hydrateSession, lastActivityTime, signOut } = useAuthStore();
  const { location, requestLocation } = useLocationStore();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    (async () => {
      await hydrateSession();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await requestLocation();
    })();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="(app)" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false, animation: 'none' }} />
      </Stack>
    </>
  )
}