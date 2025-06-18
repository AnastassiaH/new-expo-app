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
}

export const useActiveRideStore = create<ActiveRideStore>((set) => ({
  activeRide: null,
  setActiveRide: (ride: RideData | null) => set(() => ({ activeRide: ride })),
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set(() => ({ isLoading })),
  error: null,
  setError: (error: string | null) => set(() => ({ error })),
  clearError: () => set(() => ({ error: null })),
}))