import { getRouteCoords } from '@/services/places.service';
import { PlaceCoords } from '@/types';
import { useEffect, useState } from 'react';

export function useRoute(
  fromLocation: PlaceCoords | null | undefined,
  toLocation: PlaceCoords | null | undefined,
) {
  const [routeCoords, setRouteCoords] = useState<PlaceCoords[]>([]);

  useEffect(() => {
    if (!fromLocation || !toLocation || fromLocation === null || toLocation === null) return;
    getRouteCoords(fromLocation!, toLocation!)
      .then((data) => {
        if (data) {
          setRouteCoords(data)
        } else {
          setRouteCoords([])
        }
      })
      .catch(console.error);
  }, [fromLocation, toLocation]);

  return routeCoords;
}
