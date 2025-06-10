import { getDataFromCoordinates } from "@/services/places.service"
import { useLocationStore } from "@/stores/locationStore"
import { UserLocationData } from "@/types"
import { useEffect, useState } from "react"

export const useCurrentLocationData = () => {
  const locationData = useLocationStore(state => state.location)
  const [currentLocationData, setCurrentLocationData] = useState<UserLocationData | null>(null)

  useEffect(() => {
    if (!locationData?.coords.latitude || !locationData?.coords.longitude) return
    const fetchRegionData = async () => {
      const regionData = await getDataFromCoordinates(locationData?.coords.latitude, locationData?.coords.longitude);
      if (!regionData) return
      setCurrentLocationData(regionData)
    }
    fetchRegionData()
  }, [locationData?.coords.latitude, locationData?.coords.longitude])

  return { currentLocationData, currentCoords: locationData?.coords }
}
