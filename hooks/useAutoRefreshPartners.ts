import { REFRESH_PARTNERS_INTERVAL } from '@/constants'
import { usePartnersStore } from '@/stores/partnersStore'
import { useEffect } from 'react'

export const useAutoRefreshPartners = (rideId?: string) => {
  const { fetchPartners } = usePartnersStore()

  useEffect(() => {
    if (!rideId) return

    fetchPartners(rideId)

    const interval = setInterval(() => {
      fetchPartners(rideId)
    }, REFRESH_PARTNERS_INTERVAL)

    return () => clearInterval(interval)
  }, [rideId])
}