import { getPartners } from '@/services/api.service'
import { PartnerData } from '@/types'
import { create } from 'zustand'

interface PartnersStore {
  partners: PartnerData[] | null
  loading: boolean
  error: string | null
  fetchPartners: (rideId: string) => Promise<void>
}

export const usePartnersStore = create<PartnersStore>((set) => ({
  partners: null,
  loading: false,
  error: null,

  fetchPartners: async (rideId: string) => {
    set({ loading: true, error: null })
    try {
      const data = await getPartners(rideId)
      set({ partners: data, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },
}))
