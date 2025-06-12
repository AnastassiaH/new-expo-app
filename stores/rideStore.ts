import { create } from 'zustand'
import { RideData, LocationPoint } from '../types'

type RideStore = {
  activeRide: RideData | null
  historyRides: RideData[]
  fromLocation: LocationPoint | null
  toLocation: LocationPoint | null
  setActiveRide: (ride: RideData) => void
  addRideToHistory?: (ride: RideData) => void
  removeRideFromHistory?: (id: string) => void
  setFromLocation: (location: LocationPoint | null) => void
  setToLocation: (location: LocationPoint | null) => void
}

const useRideStore = create<RideStore>((set) => ({
  activeRide: null,
  historyRides: [],
  fromLocation: null,
  toLocation: null,
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
    })),
  setFromLocation: (location: LocationPoint | null) =>
    set(() => ({
      fromLocation: location
    })),
  setToLocation: (location: LocationPoint | null) =>
    set(() => ({
      toLocation: location
    }))
}))

export default useRideStore
