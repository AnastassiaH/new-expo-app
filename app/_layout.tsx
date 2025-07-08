import { useFonts } from 'expo-font';
import 'react-native-get-random-values';
import 'react-native-reanimated';

import { useAuthStore } from '@/stores/authStore';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import LocationWatcher from '@/components/feature/LocationWatcher';
import { type ErrorBoundaryProps } from 'expo-router';
import { Text, View } from 'react-native';
import { MD3DarkTheme, PaperProvider, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  const theme = useTheme()
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.onSurface }}>{error.message}</Text>
      <Text style={{ color: theme.colors.onSurface }} onPress={retry}>Try Again?</Text>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  const { session, hydrateSession } = useAuthStore();

  const theme = {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      primary: '#003049',
      onPrimary: '#fdf0d5',
      background: '#003049',
      secondaryContainer: '##F0F6FA',
      surface: '#669bbc',
      onSurface: '#fdf0d5',
      onSurfaceVariant: '#000000',
      error: '#c1121f',
      warning: '#f59e0b',
      info: '#005cc5',
      success: '#10b981',
    },
    roundness: 2,
  }

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    (async () => {
      await hydrateSession();
    })();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <StatusBar style="auto" />
        <LocationWatcher />
        <Stack>
          <Stack.Screen name="(app)" options={{ headerShown: false, animation: 'none' }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false, animation: 'none' }} />
        </Stack>
      </View>
    </PaperProvider>
  )
}