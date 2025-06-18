import { getRide } from "@/services/api.service";
import { create } from "zustand";
import { RideData } from "../types";

interface ActiveRideStore {
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  error: string | null
  setError: (error: string | null) => void
  activeRide: RideData | null
  setActiveRide: (ride: RideData | null) => void
  clearError: () => void
  fetchActiveRide: (userId: string, isActive?: boolean) => Promise<void>
}

export const useActiveRideStore = create<ActiveRideStore>((set) => ({
  activeRide: null,
  setActiveRide: (ride: RideData | null) => set(() => ({ activeRide: ride })),
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set(() => ({ isLoading })),
  error: null,
  setError: (error: string | null) => set(() => ({ error })),
  clearError: () => set(() => ({ error: null })),
  fetchActiveRide: async (userId: string, isActive = true) => {
    set({ isLoading: true, error: null })
    try {
      const rides = await getRide(userId, isActive)
      if (rides?.length > 0) {
        set({ activeRide: rides[rides.length - 1] })
      }
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ isLoading: false })
    }
  }
}))