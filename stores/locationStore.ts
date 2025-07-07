import { create } from 'zustand';

export interface LocationData {
  coords: {
    latitude: number;
    longitude: number;
    altitude?: number | null;
    accuracy?: number | null;
    heading?: number | null;
    speed?: number | null;
  };
  timestamp: number;
}

type LocationStore = {
  location: LocationData | null;
  setLocation: (location: LocationData) => void;
};

export const useLocationStore = create<LocationStore>((set) => ({
  location: null,
  setLocation: (newLocation) => set({ location: newLocation }),
}));
