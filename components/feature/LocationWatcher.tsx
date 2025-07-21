import { LOCATION_FETCHING_DISTANCE_FILTER } from '@/constants';
import { getDataFromCoordinates } from '@/services/places.service';
import { useLanguageStore } from '@/stores/languageStore';
import { useLocationStore } from '@/stores/locationStore';
import * as Location from 'expo-location';
import { useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';

export default function LocationWatcher() {
  const setLocation = useLocationStore((s) => s.setCurrentLocation);
  const setLocationData = useLocationStore((s) => s.setLocationData);
  const setLoading = useLocationStore((s) => s.setLoading);
  const language = useLanguageStore(s => s.language)

  const watcher = useRef<Location.LocationSubscription | null>(null);
  const lastLocationRef = useRef<Location.LocationObject | null>(null);

  const isSignificantChange = (newLoc: Location.LocationObject): boolean => {
    const last = lastLocationRef.current;
    if (!last) return true;

    const latDiff = Math.abs(newLoc.coords.latitude - last.coords.latitude);
    const lonDiff = Math.abs(newLoc.coords.longitude - last.coords.longitude);

    return latDiff > 0.0001 || lonDiff > 0.0001;
  };

  useEffect(() => {
    fetchLocationData(lastLocationRef.current!);
  }, [language])

  const fetchLocationData = useCallback(async (loc: Location.LocationObject) => {
    setLoading(true);
    const regionData = await getDataFromCoordinates(
      loc.coords.latitude,
      loc.coords.longitude,
      language
    );
    if (regionData) {
      setLocationData(regionData);
    }
    setLoading(false);
  }, [language]);

  const onLocationUpdate = (loc: Location.LocationObject) => {
    if (!isSignificantChange(loc)) return;

    lastLocationRef.current = loc;
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
        distanceInterval: LOCATION_FETCHING_DISTANCE_FILTER,
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
