import { getRouteCoords } from '@/services/places.service';
import { PlaceCoords } from '@/types';
import { useEffect, useState } from 'react';

export function useRoute(
  fromLocation: PlaceCoords | null,
  toLocation: PlaceCoords | null,
) {
  const [routeCoords, setRouteCoords] = useState<PlaceCoords[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (!fromLocation || !toLocation) {
      setRouteCoords([]);
      setIsCalculating(false);
      return;
    }

    if (fromLocation.latitude === toLocation.latitude &&
      fromLocation.longitude === toLocation.longitude) {
      setRouteCoords([]);
      setIsCalculating(false);
      return;
    }

    let isCurrent = true;
    setIsCalculating(true);

    getRouteCoords(fromLocation, toLocation)
      .then((data) => {
        if (!isCurrent) return;

        if (data && Array.isArray(data) && data.length > 0) {
          const validCoords = data.filter(coord =>
            typeof coord.latitude === 'number' &&
            typeof coord.longitude === 'number'
          );

          if (validCoords.length > 0) {
            setRouteCoords(validCoords);
          } else {
            setRouteCoords([]);
          }
        } else {
          setRouteCoords([]);
        }
        setIsCalculating(false);
      })
      .catch((error) => {
        console.error('Error calculating route:', error);
        if (isCurrent) {
          setRouteCoords([]);
          setIsCalculating(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [fromLocation, toLocation]);

  return { routeCoords, isCalculating };
}
