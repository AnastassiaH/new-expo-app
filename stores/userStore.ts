
import { LocationPoint, UserData } from '@/types';
import * as SecureStore from 'expo-secure-store';
import { create } from "zustand";

const HOME_ADDRESS_KEY = 'home_address'

type UserStore = {
  user: UserData | null;
  homeAddress: LocationPoint | null;
  setUser: (user: UserData | null) => void;
  setHomeAddress: (homeAddress: LocationPoint | null) => void;
  loadPersistedHomeAddress: () => Promise<void>;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  homeAddress: null,
  setUser: (newUser: UserData | null) => set({ user: newUser }),
  setHomeAddress: (newHomeAddress: LocationPoint | null) => set({ homeAddress: newHomeAddress }),
  loadPersistedHomeAddress: async () => {
    try {
      const storedAddress = await SecureStore.getItemAsync(HOME_ADDRESS_KEY)
      if (storedAddress) {
        set({ homeAddress: JSON.parse(storedAddress) })
      }
    } catch (error) {
      console.error('Error loading persisted home address:', error)
    }
  },
}));
