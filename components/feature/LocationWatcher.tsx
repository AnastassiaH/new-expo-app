import { DISTANCE_FILTER } from '@/constants';
import { getDataFromCoordinates } from '@/services/places.service';
import { useLocationStore } from '@/stores/locationStore';
import * as Location from 'expo-location';
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

export default function LocationWatcher() {
  const setLocation = useLocationStore((s) => s.setCurrentLocation);
  const setLocationData = useLocationStore((s) => s.setLocationData);
  const setLoading = useLocationStore((s) => s.setLoading);

  const watcher = useRef<Location.LocationSubscription | null>(null);

  const fetchLocationData = async (loc: Location.LocationObject) => {
    setLoading(true);
    const regionData = await getDataFromCoordinates(
      loc.coords.latitude,
      loc.coords.longitude
    );
    if (regionData) {
      setLocationData(regionData);
    }
    setLoading(false);
  };

  const onLocationUpdate = (loc: Location.LocationObject) => {
    setLocation(loc);
    fetchLocationData(loc);
  };

  const startWatch = async () => {
    if (watcher.current) return;
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) return;

    watcher.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: DISTANCE_FILTER,
      },
      onLocationUpdate
    );
  };

  const stopWatch = () => {
    watcher.current?.remove();
    watcher.current = null;
  };

  useEffect(() => {
    startWatch();

    const sub = AppState.addEventListener('change', (state) => {
      state === 'active' ? startWatch() : stopWatch();
    });

    return () => {
      stopWatch();
      sub.remove();
    };
  }, []);

  return null;
}
