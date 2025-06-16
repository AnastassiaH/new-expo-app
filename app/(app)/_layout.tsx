import { AutoLogoutTimer } from "@/components/feature/AutoLogoutTimer";
import DrawerButton from "@/components/feature/DrawerButton";
import { useAuthStore } from "@/stores/authStore";
import { useLocationStore } from "@/stores/locationStore";
import { Redirect } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useEffect } from "react";
import { useTheme } from "react-native-paper";

export default function RootLayout() {
  const { session, isReady } = useAuthStore();
  const { requestLocation, location } = useLocationStore();
  const theme = useTheme()

  useEffect(() => {
    if (!location) {
      requestLocation()
    }
  }, [location]);

  if (!isReady) {
    return null;
  }

  if (!session) {
    return <Redirect href="/(auth)" />
  }

  return (
    <>
      <AutoLogoutTimer />
      <Drawer screenOptions={{
        headerTitle: '',
        headerLeft: () => <DrawerButton />,
        headerTransparent: true,
        headerTintColor: theme.colors.onSurface,
        drawerActiveTintColor: theme.colors.primary,
        drawerActiveBackgroundColor: theme.colors.onSurface,
        drawerInactiveTintColor: theme.colors.onSurface,
        drawerStyle: {
          backgroundColor: theme.colors.background,
        },
        overlayColor: 'transparent',
      }} />
    </>
  )
}