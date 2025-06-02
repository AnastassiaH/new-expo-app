import { AutoLogoutTimer } from "@/components/AutoLogoutTimer";
import { useAuthStore } from "@/stores/authStore";
import { useLocationStore } from "@/stores/locationStore";
import { Redirect, Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const { session, isReady } = useAuthStore();
  const { requestLocation } = useLocationStore();

  useEffect(() => {
    (async () => {
      await requestLocation();
    })();
  }, []);

  if (!isReady) {
    return null;
  }

  if (!session) {
    return <Redirect href="/(auth)" />
  }

  return (
    <>
      <AutoLogoutTimer />
      <Stack>
        <Stack.Screen name="ride" options={{ headerShown: false }} />
        <Stack.Screen name="partners" options={{ headerShown: false }} />
      </Stack>
    </>
  )
}