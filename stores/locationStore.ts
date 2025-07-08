import { City, UserLocationData } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

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

export interface LocationStore {
  currentLocation: LocationData | null;
  locationData: UserLocationData | null;
  customCity: City | null;
  useCustomCity: boolean;
  selectorVisible: boolean;
  loading: boolean;

  setCurrentLocation: (location: LocationData) => void;
  setLocationData: (locationData: UserLocationData | null) => void;
  setCustomCity: (city: City | null) => void;
  toggleUseCustomCity: () => void;
  setSelectorVisible: (visible: boolean) => void;
  setUseCustomCity: (useCustomCity: boolean) => void;
  setLoading: (loading: boolean) => void;
}

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      currentLocation: null as LocationData | null,
      customCity: null as City | null,
      useCustomCity: false,
      selectorVisible: false,
      locationData: null as UserLocationData | null,
      loading: false,

      setCurrentLocation: (newLocation: LocationData) => set({ currentLocation: newLocation }),
      setCustomCity: (city: City | null) => set({ customCity: city }),
      setUseCustomCity: (useCustomCity: boolean) => set({ useCustomCity }),
      toggleUseCustomCity: () => set((state: LocationStore) => ({ useCustomCity: !state.useCustomCity })),
      setSelectorVisible: (visible: boolean) => set({ selectorVisible: visible }),
      setLocationData: (locationData: UserLocationData | null) => set({ locationData }),
      setLoading: (loading: boolean) => set({ loading }),
    }),
    {
      name: 'location-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state: LocationStore) => ({
        customCity: state.customCity,
      }),
    }
  )
);
