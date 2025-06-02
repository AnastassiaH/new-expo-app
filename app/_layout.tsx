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
import { Text, View } from 'react-native';

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={{ flex: 1, backgroundColor: "red" }}>
      <Text>{error.message}</Text>
      <Text onPress={retry}>Try Again?</Text>
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { session, hydrateSession } = useAuthStore();
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