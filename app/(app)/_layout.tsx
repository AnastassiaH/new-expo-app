import { AutoLogoutTimer } from "@/components/feature/AutoLogoutTimer";
import CustomDrawer from "@/components/feature/CustomDrawer";
import { Loader } from "@/components/ui";
import { useActiveRideStore } from "@/stores/activeRideStore";
import { useAuthStore } from "@/stores/authStore";
import { useLocationStore } from "@/stores/locationStore";
import { useUserStore } from "@/stores/userStore";
import { Redirect, router } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const { session, isReady, signOut } = useAuthStore();
  const { requestLocation, location } = useLocationStore();
  const { activeRide, fetchActiveRide, isLoading } = useActiveRideStore()
  const user = useUserStore((state) => state.user);
  const isHydrated = useUserStore((state) => state.isHydrated);

  useEffect(() => {
    if (user?.id) {
      fetchActiveRide(user.id)
    }
  }, [user?.id])

  useEffect(() => {
    if (activeRide) {
      router.replace('/(app)/Partners')
    }
  }, [activeRide])

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

  if (!isHydrated || isLoading) {
    return <Loader />;
  }

  return (
    <>
      <AutoLogoutTimer />
      <CustomDrawer />
    </>
  )
}