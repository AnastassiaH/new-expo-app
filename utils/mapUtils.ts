import { INITIAL_MAP_REGION } from '@/constants';
import { PlaceCoords } from '@/types';

export const getRegionFromLocation = (location: { coords: PlaceCoords }) => ({
  latitude: location.coords.latitude,
  longitude: location.coords.longitude,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
});

export const getRegionFromCity = (place: PlaceCoords) => ({
  latitude: place.latitude,
  longitude: place.longitude,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
});

export const getMapRegion = (
  coords: PlaceCoords | null,
  customCity: PlaceCoords | null,
  useCustomCity: boolean
) => {
  if (customCity && useCustomCity) {
    return getRegionFromCity(customCity);
  }
  if (coords) {
    return getRegionFromLocation({ coords });
  }
  return INITIAL_MAP_REGION;
};
