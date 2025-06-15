import { AutoLogoutTimer } from "@/components/feature/AutoLogoutTimer";
import DrawerButton from "@/components/feature/DrawerButton";
import { useAuthStore } from "@/stores/authStore";
import { useLocationStore } from "@/stores/locationStore";
import { Redirect } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useEffect } from "react";

export default function RootLayout() {
  const { session, isReady } = useAuthStore();
  const { requestLocation, location } = useLocationStore();

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
        headerTintColor: '#ccc',
        drawerActiveTintColor: '#000',
        drawerActiveBackgroundColor: '#ccc',
        drawerInactiveTintColor: '#000',
        drawerStyle: {
          backgroundColor: '#ccc',
        },
        overlayColor: '#ccc',
      }} />
    </>
  )
}