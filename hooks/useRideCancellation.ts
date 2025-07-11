import { cancelRide } from '@/services/api.service'
import { useActiveRideStore } from '@/stores/activeRideStore'
import { useRouter } from 'expo-router'
import { useState } from 'react'

export const useRideCancellation = () => {
  const router = useRouter()
  const { activeRide, setActiveRide } = useActiveRideStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirmCancel = async () => {
    setLoading(true)
    setError(null)
    try {
      if (!activeRide?.id) return
      await cancelRide(activeRide.id)
      setActiveRide(null)
      router.replace('/(app)/ride' as never)
    } catch (error: any) {
      setError(error?.message || 'Failed to cancel ride')
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    handleConfirmCancel,
  }
}
