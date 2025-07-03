import { INITIAL_MAP_REGION } from '@/constants';
import { City, LocationPoint } from '@/types';
import { useEffect, useMemo, useState } from 'react';
import { Region } from 'react-native-maps';

export function useMapRegion(
  currentCoords?: LocationPoint,
  customCityCoords?: City,
) {

  const nextRegion = useMemo<Region>(() => {
    if (currentCoords) return { latitude: currentCoords.latitude, longitude: currentCoords.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 };
    if (customCityCoords) return { latitude: customCityCoords.latitude, longitude: customCityCoords.longitude, latitudeDelta: 0.3, longitudeDelta: 0.3 };
    return INITIAL_MAP_REGION;
  }, [currentCoords?.latitude, currentCoords?.longitude, customCityCoords?.latitude, customCityCoords?.longitude]);

  const [region, setRegion] = useState<Region>(nextRegion);

  useEffect(() => {
    setRegion(nextRegion);
  }, [nextRegion]);

  useEffect(() => {
    if (currentCoords) {
      setRegion({
        latitude: currentCoords.latitude,
        longitude: currentCoords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } else if (customCityCoords) {
      setRegion({
        latitude: customCityCoords.latitude,
        longitude: customCityCoords.longitude,
        latitudeDelta: 0.3,
        longitudeDelta: 0.3,
      });
    }
  }, [currentCoords?.latitude, currentCoords?.longitude, customCityCoords?.latitude, customCityCoords?.longitude]);

  return region;
}
