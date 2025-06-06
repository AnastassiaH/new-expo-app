import { getGeocodeDataFromCoordinates } from "@/services/places.service"
import { useLocationStore } from "@/stores/locationStore"
import { RegionData } from "@/types"
import { useEffect, useState } from "react"

export const useRegionData = () => {
  const locationData = useLocationStore(state => state.location)
  const [regionData, setRegionData] = useState<RegionData | null>(null)

  useEffect(() => {
    if (!locationData?.coords.latitude || !locationData?.coords.longitude) return
    const fetchRegionData = async () => {
      const regionData = await getGeocodeDataFromCoordinates(locationData?.coords.latitude, locationData?.coords.longitude);
      setRegionData(regionData || null)
    }
    fetchRegionData()
  }, [])

  return { regionData }
}
