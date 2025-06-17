import { LocationPoint, UserData } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type UserStore = {
  user: UserData | null;
  homeAddress: LocationPoint | null;
  isHydrated: boolean;
  setUser: (user: UserData | null) => void;
  setHomeAddress: (address: LocationPoint | null) => void;
};

let setIsHydratedExternal: (() => void) | null = null;

export const useUserStore = create<UserStore>()(
  persist(
    (set) => {
      setIsHydratedExternal = () => set({ isHydrated: true });
      return {
        user: null,
        homeAddress: null,
        isHydrated: false,
        setUser: (user) => set({ user }),
        setHomeAddress: (homeAddress) => set({ homeAddress }),
      };
    },
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        homeAddress: state.homeAddress,
      }),
      onRehydrateStorage: () => {
        return () => {
          setIsHydratedExternal?.();
        };
      },
    }
  )
);
