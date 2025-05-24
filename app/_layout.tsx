import { useLocationStore } from '@/stores/locationStore';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { router, Slot } from 'expo-router';

const isAuthenticated = false;

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const { requestLocation } = useLocationStore();

  useEffect(() => {
    if (loaded) {
      requestLocation();
    }
  }, [loaded, requestLocation]);

  useEffect(() => {
    if (loaded && isAuthenticated !== null) {
      if (isAuthenticated) {
        router.replace('/(app)/ride');
      } else {
        router.replace('/(auth)');
      }
    }
  }, [loaded, isAuthenticated]);

  if (!loaded) {
    return null;
  }

  return <Slot />
}