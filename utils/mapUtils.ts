import { INITIAL_MAP_REGION } from '@/constants';

export const getRegionFromLocation = (location: { coords: { latitude: number; longitude: number } }) => ({
  latitude: location.coords.latitude,
  longitude: location.coords.longitude,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
});

export const getRegionFromCity = (city: { latitude: number; longitude: number }) => ({
  latitude: city.latitude,
  longitude: city.longitude,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
});

export const getInitialRegion = (
  location?: { coords: { latitude: number; longitude: number } },
  customCity?: { latitude: number; longitude: number }
) => {
  if (location) {
    return getRegionFromLocation(location);
  }
  if (customCity) {
    return getRegionFromCity(customCity);
  }
  return INITIAL_MAP_REGION;
};
