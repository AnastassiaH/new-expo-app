import { AutoLogoutTimer } from "@/components/AutoLogoutTimer";
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
        headerLeft: () => <DrawerButton />,
        drawerActiveTintColor: 'black',
        drawerActiveBackgroundColor: '#ccc',
        drawerInactiveTintColor: 'black',
        drawerInactiveBackgroundColor: 'transparent',
        drawerType: 'slide',
        overlayColor: '#ccc',
        drawerStyle: {
          backgroundColor: '#ccc',
        },
        headerTitle: '',
        headerStyle: {
          backgroundColor: 'transparent',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTransparent: true,
      }}>
        <Drawer.Screen
          name="ride"
          options={{ drawerLabel: 'Ride' }}
        />
        <Drawer.Screen
          name="partners"
          options={{ drawerLabel: 'Partners' }}
        />
        <Drawer.Screen
          name="settings"
          options={{ drawerLabel: 'Settings' }}
        />
        <Drawer.Screen
          name="account"
          options={{ drawerLabel: 'Account' }}
        />
      </Drawer>
    </>
  )
}