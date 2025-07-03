import { City } from "@/types";
import { create } from "zustand";

interface CitySelectorStore {
  selectorVisible: boolean;
  setSelectorVisible: (visible: boolean) => void;
  customCity: City | null;
  setCustomCity: (city: City | null) => void;
}

export const useCitySelectorStore = create<CitySelectorStore>((set) => ({
  selectorVisible: false,
  setSelectorVisible: (visible: boolean) => set({ selectorVisible: visible }),
  customCity: null,
  setCustomCity: (city: City | null) => set({ customCity: city }),
}))