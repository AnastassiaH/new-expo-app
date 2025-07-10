import { PartnerData } from '@/types'
import { create } from 'zustand'

interface PartnersStore {
  partners: PartnerData[] | null

  setPartners: (partners: PartnerData[] | null) => void
}

export const usePartnersStore = create<PartnersStore>((set) => ({
  partners: null,
  setPartners: (partners: PartnerData[] | null) => set({ partners }),
}))
