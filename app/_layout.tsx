import { useFonts } from 'expo-font';
import 'react-native-get-random-values';
import 'react-native-reanimated';

import { useAuthStore } from '@/stores/authStore';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import LocationWatcher from '@/components/feature/LocationWatcher';
import i18n, { initI18n } from '@/lib/i18n';
import { useLanguageStore } from '@/stores/languageStore';
import { Stack, type ErrorBoundaryProps } from 'expo-router';
import { I18nextProvider } from 'react-i18next';
import { Text, View } from 'react-native';
import { MD3DarkTheme, PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
      <Text style={{ color: 'white' }}>{error.message}</Text>
      <Text style={{ color: 'white' }} onPress={retry}>Try Again?</Text>
    </SafeAreaView>
  )
}

export default function RootLayout() {
  const { session, hydrateSession } = useAuthStore();
  const language = useLanguageStore((s) => s.language);

  const theme = {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      primary: '#003049',
      onPrimary: '#fdf0d5',
      background: '#003049',
      secondaryContainer: '#F0F6FA',
      surface: '#669bbc',
      surfaceDisabled: '#c0d8e6',
      onSurface: '#fdf0d5',
      surfaceVariant: '#fdf0d5',
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

  useEffect(() => {
    initI18n(language)
      .catch((e) => {
        throw e;
      });
  }, [language]);

  if (!loaded) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
          <StatusBar style="auto" />
          <LocationWatcher />
          <Stack>
            <Stack.Screen name="(app)" options={{
              headerShown: false,
              animation: 'fade',
              animationDuration: 300,
            }} />
            <Stack.Screen name="(auth)" options={{
              headerShown: false,
              animation: 'fade',
              animationDuration: 300,
            }} />
          </Stack>
        </View>
      </I18nextProvider>
    </PaperProvider>
  )
}