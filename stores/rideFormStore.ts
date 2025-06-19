import { create } from 'zustand'
import { LocationPoint } from '../types'

type RideFormStore = {
  fromLocation: LocationPoint | null
  toLocation: LocationPoint | null
  setFromLocation: (location: LocationPoint | null) => void
  setToLocation: (location: LocationPoint | null) => void
  clearForm: () => void
}

const useRideFormStore = create<RideFormStore>((set) => ({
  fromLocation: null,
  toLocation: null,
  setFromLocation: (location: LocationPoint | null) =>
    set(() => ({
      fromLocation: location
    })),
  setToLocation: (location: LocationPoint | null) =>
    set(() => ({
      toLocation: location
    })),
  clearForm: () =>
    set(() => ({
      fromLocation: null,
      toLocation: null
    }))
}))

export default useRideFormStore
