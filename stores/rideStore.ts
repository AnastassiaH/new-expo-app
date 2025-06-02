import { create } from 'zustand'
import { RideData } from '../types'

type RideStore = {
  activeRide: RideData | null
  historyRides: RideData[]
  setActiveRide: (ride: RideData) => void
  addRideToHistory?: (ride: RideData) => void
  removeRideFromHistory?: (id: string) => void
}

const useRideStore = create<RideStore>((set) => ({
  activeRide: null,
  historyRides: [],
  setActiveRide: (ride) =>
    set(() => ({
      activeRide: ride
    })),
  addRideToHistory: (ride: RideData) =>
    set((state) => ({
      historyRides: [...state.historyRides, ride]
    })),
  removeRideFromHistory: (id: string) =>
    set((state) => ({
      historyRides: state?.historyRides?.filter((ride) => ride.id !== id)
    }))
}))

export default useRideStore
