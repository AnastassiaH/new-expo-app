import { City } from "@/types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface CitySelectorStore {
  selectorVisible: boolean;
  setSelectorVisible: (visible: boolean) => void;
  customCity: City | null;
  setCustomCity: (city: City | null) => void;
}

export const useCitySelectorStore = create<CitySelectorStore>()(
  persist(
    (set) => ({
      selectorVisible: false,
      setSelectorVisible: (visible: boolean) => set({ selectorVisible: visible }),
      customCity: null,
      setCustomCity: (city: City | null) => set({ customCity: city }),
    }),
    {
      name: 'city-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        customCity: state.customCity,
      }),
    }
  )
);