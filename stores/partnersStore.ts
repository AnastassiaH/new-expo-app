import { PartnerData } from '@/types'
import { create } from 'zustand'

type PartnersStore = {
  partners: PartnerData[]
  setPartners: (partners: PartnerData[]) => void
  clearPartners: () => void
}

const usePartnersStore = create<PartnersStore>((set) => ({
  partners: [],
  setPartners: (partners) => set({ partners }),
  clearPartners: () => set({ partners: [] }),
}))

export default usePartnersStore
