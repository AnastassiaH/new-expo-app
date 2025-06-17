import { create } from "zustand";

export const useAuthError = create<{
  error: string | null;
  setError: (msg: string) => void;
  clearError: () => void;
}>((set) => ({
  error: null,
  setError: (msg) => set({ error: msg }),
  clearError: () => set({ error: null }),
}));
