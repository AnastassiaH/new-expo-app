import { create } from "zustand";

interface PhoneStore {
  phone: string;
  setPhone: (phone: string) => void;
}

const usePhoneStore = create<PhoneStore>((set) => ({
  phone: '',
  setPhone: (phone: string) => set({ phone }),
}))

export default usePhoneStore