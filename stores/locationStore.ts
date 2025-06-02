import * as Location from 'expo-location';
import { create } from 'zustand';

interface LocationData {
  coords: {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
}

type LocationStore = {
  location: LocationData | null;
  requestLocation: () => Promise<void>;
  setLocation: (location: LocationData) => void;
};

export const useLocationStore = create<LocationStore>((set) => ({
  location: null,
  setLocation: (newLocation) => set({ location: newLocation }),
  requestLocation: async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission to access location was denied');
      }

      const location = await Location.getCurrentPositionAsync({});
      set({ location });
    } catch (error: any) {
      console.log('Location error', error)
    }
  },
}));
