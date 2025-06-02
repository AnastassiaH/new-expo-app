import axios from 'axios'
import { LocationPoint } from '../types'

export const fetchRoute = async (from: LocationPoint, to: LocationPoint) => {
  try {
    const response = await axios.get(
      `http://router.project-osrm.org/route/v1/driving/${from.longitude},${from.latitude};${to.longitude},${to.latitude}?overview=full&geometries=geojson`
    )

    if (response.data && response.data.routes && response.data.routes[0]) {
      return response.data.routes[0].geometry.coordinates.map((coord: [number, number]) => ({
        latitude: coord[1],
        longitude: coord[0]
      }))
    }
    return null
  } catch (error) {
    console.log('Error fetching route:', error)
    return null
  }
}

export const adjustMapRegion = (from: LocationPoint, to: LocationPoint) => {
  if (!from || !to) return null;

  const centerLat = (from.latitude + to.latitude) / 2;
  const centerLng = (from.longitude + to.longitude) / 2;

  return {
    latitude: centerLat,
    longitude: centerLng,
    latitudeDelta: Math.max(
      Math.abs(from.latitude - to.latitude) * 1.5,
      0.01
    ),
    longitudeDelta: Math.max(
      Math.abs(from.longitude - to.longitude) * 1.5,
      0.01
    ),
  };
}; 