import { getDataFromCoordinates } from "@/services/places.service"
import { useLocationStore } from "@/stores/locationStore"
import { UserLocationData } from "@/types"
import { useEffect, useState } from "react"

export const useCurrentLocationData = () => {
  const locationData = useLocationStore(state => state.location)
  const [loading, setLoading] = useState(false)
  const [currentLocationData, setCurrentLocationData] = useState<UserLocationData | undefined>(undefined)

  useEffect(() => {
    if (!locationData?.coords.latitude || !locationData?.coords.longitude) return

    const fetchRegionData = async () => {
      setLoading(true)
      const regionData = await getDataFromCoordinates(locationData?.coords.latitude, locationData?.coords.longitude);

      if (regionData) {
        setCurrentLocationData(regionData)
        setLoading(false)
      }
    }
    fetchRegionData()
  }, [locationData?.coords.latitude, locationData?.coords.longitude])

  return { currentLocationData, loading }
}
