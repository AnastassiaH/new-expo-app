import { AutoLogoutTimer } from "@/components/feature/AutoLogoutTimer";
import CitySelector from "@/components/feature/CitySelector";
import CustomDrawer from "@/components/feature/CustomDrawer";
import { ErrorModal, Loader } from "@/components/ui";
import { UNAUTHORIZED_ERROR_MESSAGE } from "@/constants";
import { useActiveRideStore } from "@/stores/activeRideStore";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import { Redirect, router } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const { session, isReady } = useAuthStore();
  const { activeRide, fetchActiveRide, isLoading } = useActiveRideStore()
  const activeRideError = useActiveRideStore(s => s.error)
  const setActiveRideError = useActiveRideStore(s => s.setError)
  const user = useUserStore((state) => state.user);
  const isHydrated = useUserStore((state) => state.isHydrated);
  const signOut = useAuthStore(s => s.signOut)

  useEffect(() => {
    if (user?.id) {
      fetchActiveRide(user.id)
    }
  }, [user?.id])

  useEffect(() => {
    if (!activeRide) return

    const timeout = setTimeout(() => {
      router.replace('/(app)/partners' as never)
    }, 0)

    return () => clearTimeout(timeout)
  }, [activeRide])

  if (!isReady) {
    return null;
  }

  if (!session) {
    return <Redirect href="/(auth)" />
  }

  if (!isHydrated || isLoading) {
    return <Loader />;
  }

  if (activeRideError) {
    return (
      <ErrorModal
        visible={!!activeRideError}
        message={activeRideError}
        onClose={() => {
          setActiveRideError(null)
          activeRideError === UNAUTHORIZED_ERROR_MESSAGE
            ? signOut()
            : router.reload()
        }}
      />
    )
  }

  return (
    <>
      <AutoLogoutTimer />
      <CustomDrawer />
      <CitySelector />
    </>
  )
}