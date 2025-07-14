import { INITIAL_MAP_REGION } from "@/constants";
import { City, LocationData } from "@/types";
import { MapRegion } from "@/types/MapTypes";
import { useEffect, useState } from "react";

export const useMapRegion = (
  currentLocation?: LocationData | null,
  customCity?: City | null,
  useCustomCity?: boolean,
) => {
  const [mapRegion, setMapRegion] = useState<MapRegion>(INITIAL_MAP_REGION);

  useEffect(() => {
    if (useCustomCity && customCity) {
      setMapRegion({
        latitude: customCity.latitude,
        longitude: customCity.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      return;
    }
    if (currentLocation) {
      setMapRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [currentLocation, customCity, useCustomCity]);

  return mapRegion;
}
