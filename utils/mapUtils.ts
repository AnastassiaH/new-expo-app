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

export const getInitialRegion = (
  coords?: PlaceCoords,
  customCity?: PlaceCoords
) => {
  if (coords) {
    return getRegionFromLocation({ coords });
  }
  if (customCity) {
    return getRegionFromCity(customCity);
  }
  return INITIAL_MAP_REGION;
};
