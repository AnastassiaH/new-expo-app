import { UNAUTHORIZED_ERROR_MESSAGE } from "@/constants";
import { getRide } from "@/services/api.service";
import { RideData } from "@/types";
import { create } from "zustand";

interface ActiveRideStore {
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  error: string | null
  setError: (error: string | null) => void
  activeRide: RideData | null
  setActiveRide: (ride: RideData | null) => void
  fetchActiveRide: (userId: string, isActive?: boolean) => Promise<void>
}

export const useActiveRideStore = create<ActiveRideStore>((set) => ({
  activeRide: null,
  setActiveRide: (ride: RideData | null) => set(() => ({ activeRide: ride })),
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set(() => ({ isLoading })),
  error: null,
  setError: (error: string | null) => set(() => ({ error })),
  fetchActiveRide: async (userId: string, isActive = true) => {
    set({ isLoading: true, error: null })
    try {
      const rides = await getRide(userId, isActive)
      if (rides?.length > 0) {
        set({ activeRide: rides[rides.length - 1] })
      }
    } catch (error: any) {
      if (error?.message === 'Request failed with status code 401'
        || error?.message === 'Request failed with status code 403') {
        set({ error: UNAUTHORIZED_ERROR_MESSAGE })
      } else {
        set({ error: error?.message })
      }
    } finally {
      set({ isLoading: false })
    }
  }
}))